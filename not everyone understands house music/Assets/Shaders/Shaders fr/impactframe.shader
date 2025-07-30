Shader "Converted/TemplateBlit"
{
    Properties
    {
        _MainTex ("iChannel0", 2D) = "white" {}
        _SecondTex ("iChannel1", 2D) = "white" {}
        _ThirdTex ("iChannel2", 2D) = "white" {}
        _FourthTex ("iChannel3", 2D) = "white" {}
        _Mouse ("Mouse", Vector) = (0.5, 0.5, 0.5, 0.5)
        [ToggleUI] _GammaCorrect ("Gamma Correction", Float) = 1
        _Resolution ("Resolution (Change if AA is bad)", Range(1, 1024)) = 1
    }

    SubShader
    {
        Cull Off ZWrite Off ZTest Always

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_SecondTex);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_ThirdTex);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_FourthTex);

           
            float _GammaCorrect;
            float _Resolution;
            float4 _Mouse;

            
            #define glsl_mod(x, y) (((x) - (y) * floor((x) / (y))))
            #define texelFetch(ch, uv, lod) tex2Dlod(ch, float4((uv).xy * ch##_TexelSize.xy + ch##_TexelSize.xy * 0.5, 0, lod))
            #define textureLod(ch, uv, lod) tex2Dlod(ch, float4(uv, 0, lod))
            #define iResolution float3(_Resolution, _Resolution, _Resolution)
            #define iFrame (floor(_Time.y / 60))
            #define iChannelTime float4(_Time.y, _Time.y, _Time.y, _Time.y)
            #define iDate float4(2020, 6, 18, 30)
            #define iSampleRate (44100)
            #define iChannelResolution float4x4(                      \
                _MainTex_TexelSize.z,   _MainTex_TexelSize.w,   0, 0, \
                _SecondTex_TexelSize.z, _SecondTex_TexelSize.w, 0, 0, \
                _ThirdTex_TexelSize.z,  _ThirdTex_TexelSize.w,  0, 0, \
                _FourthTex_TexelSize.z, _FourthTex_TexelSize.w, 0, 0)

            
            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            
            v2f vert(appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            
            float3 blackWhite(in float3 color)
            {
                float threshold = 0.4;
                float3 tint = float3(1., 1., 1.);
                bool flip = false;
                float brightness = (color.r + color.g + color.b) / 3.;
                float thresholded = lerp(0., 1., step(threshold, brightness));
                if (flip)
                {
                    thresholded = 1. - thresholded;
                }

                return (float3)thresholded * tint;
            }

            
            float4 radialBlur(in float2 fragCoord)
            {
                int nsamples = 20;
                float2 center = _Mouse.xy / float2(_Resolution, _Resolution); // Fix resolution scaling
                float blurWidth = 0.13;
                float blurStart = 1.0 - blurWidth;
                float2 uv = fragCoord / float2(_Resolution, _Resolution); // Fix resolution scaling
                uv -= center;
                float precompute = blurWidth * (1.0 / float(nsamples - 1));
                float4 color = float4(0, 0, 0, 1);

                for (int i = 0; i < nsamples; i++)
                {
                    float scale = blurStart + float(i) * precompute;
                    
                    color.rgb += blackWhite(tex2D(_MainTex, uv * scale + center).rgb);
                }

                color /= float(nsamples);
                return color;
            }

            
            fixed4 frag(v2f i) : SV_Target
            {
                
                float4 fragColor = 0;
                float2 fragCoord = i.uv * float2(_Resolution, _Resolution);
                fragColor = radialBlur(fragCoord);

                if (_GammaCorrect)
                    fragColor.rgb = pow(fragColor.rgb, 2.2);

                return fragColor;
            }

            ENDCG
        }
    }

    Fallback "Diffuse"
}
