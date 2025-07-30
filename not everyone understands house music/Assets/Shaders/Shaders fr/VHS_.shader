Shader "BeatSaber/VHS" {
    //Thank you TheGoodBoi (Droobix)
    Properties {
        _MainTex ("Texture", 2D) = "white" {}
        _ChromaticAberration ("Chromatic Aberration", Range(0, 1)) = 0.02
        _Mute ("Color Mute", Range(0, 1)) = 0.5
        _Pixelate ("Pixelate", Range(0, 1)) = 0.5
        _Scanline ("Scanline Intensity", Range(0, 1)) = 0.2
        _Gap ("Scanline Gap", Range(0, 10)) = 6.0
        _Noise ("Noise Intensity", Range(0, 1)) = 0.3
        _Limit ("Noise Limit", Range(0, 1)) = 0.2
        _Shake ("Shake", Range(0, 1)) = 0.1
        _Bars ("Bars", Range(0, 0.5)) = 0.375
        _Bars2 ("Bars2", Range(0, 0.5)) = 0.375 
        _Seed ("Seed", Range(0, 10)) = 0.0
    }
    SubShader {

        Cull Off ZWrite Off ZTest Always
        
        Pass {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };
            
            struct v2f {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
                UNITY_VERTEX_OUTPUT_STEREO
            };
            
            v2f vert (appdata v) {
                v2f o;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);
            float _ChromaticAberration;
            float _Mute;
            float _Pixelate;
            float _Scanline;
            float _Gap;
            float _Noise;
            float _Limit;
            float _Seed;
            float _Shake;
            float _Bars;
            float _Bars2; 

            float4 frag (v2f i) : SV_Target {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);
                
                _Pixelate = 1.0 - _Pixelate;
                _Pixelate *= _ScreenParams.x;

                float x = i.uv.x;
                i.uv.x = floor(i.uv.x * _Pixelate) / _Pixelate;
                _Pixelate /= _ScreenParams.x;
                _Pixelate *= _ScreenParams.y;
                float y = i.uv.y;
                i.uv.y = floor(i.uv.y * _Pixelate) / _Pixelate;

                float move = frac(sin((_Seed + 69.69) * 78.233) * 43758.5453123) * _Shake / 100;
                i.uv.y -= move;

                float redOff = _ChromaticAberration * _ScreenParams.y * 0.0001;
                float greenOff = _ChromaticAberration * _ScreenParams.y * -0.0001;
                fixed4 color = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(i.uv));
                color.r = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(i.uv) + float2(redOff, 0)).r;
                color.b = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(i.uv) + float2(greenOff, 0)).b;

                i.uv.x = x;
                i.uv.y = y;

                color.rgb = clamp(color.rgb, _Mute / 3.0, 1.0 - _Mute) - _Mute / 3.0;


                i.uv.x -= 0.5;
                color.rgb -= 30.0 * (1.0 - step(abs(i.uv.x), _Bars));
                i.uv.x += 0.5;


                i.uv.y -= 0.5;
                color.rgb -= 30.0 * (1.0 - step(abs(i.uv.y), _Bars2));
                i.uv.y += 0.5;

                i.uv.y += move;

                i.uv.x *= 400;
                i.uv.y += 0.1;
                i.uv.y *= 300;

                i.uv.x += 3.0 * (floor(i.uv.y * i.uv.y) + 1.0) * 0.1;

                float2 ipos = floor(i.uv.xy);
                float noise = floor(frac(sin(dot(ipos.xy, float2(12.9898, 78.233))) * 43758.5453123 * (_Seed + 69.69)) + (_Noise - i.uv.y / 800));
                color.rgb += clamp(noise, 0.0, 1.0) * step(i.uv.y / 300, _Limit);

                i.uv.x /= 800;
                i.uv.y -= 0.1;
                i.uv.y /= 300;

                color.rgb = clamp(color.rgb, 0.0, 1.0);

                float scanline = (sin(i.uv.y * _ScreenParams.y * 3.1415 / _Gap) + 1.0) / 2.0;
                scanline *= _Scanline;
                color.rgb -= scanline;

                return color;
            }
            ENDCG
        }
    }
}