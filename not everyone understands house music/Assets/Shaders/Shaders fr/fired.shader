Shader "Custom/HueSaturationThing"
{
    Properties
    {
        _MainTex ("Main Texture", 2D) = "white" {}
        _Color ("Color", Color) = (1, 1, 1, 1)
        _Contrast ("Contrast", Range(-1, 1)) = 0.0
        _Hue ("Hue", Range(-1, 1)) = 0.0
        _Saturation ("Saturation", Range(-1, 1)) = 0.0
        _Brightness ("Brightness", Range(-1, 1)) = 0.0
        _HSVRangeMin ("HSV Range Min", Range(0, 1)) = 0
        _HSVRangeMax ("HSV Range Max", Range(0, 1)) = 1
    }
    SubShader
    {
        Tags { "RenderType" = "Opaque" }
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            float4 _Color;
            float _Contrast;
            float _Hue;
            float _Saturation;
            float _Brightness;
            float _HSVRangeMin;
            float _HSVRangeMax;

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex); 

            
            float3 rgb2hsv(float3 c)
            {
                float M = max(max(c.r, c.g), c.b);
                float m = min(min(c.r, c.g), c.b);
                float C = M - m;

                float H = 0;
                if (C > 0)
                {
                    if (M == c.r)
                        H = (c.g - c.b) / C;
                    else if (M == c.g)
                        H = (c.b - c.r) / C + 2.0;
                    else
                        H = (c.r - c.g) / C + 4.0;
                    H = frac(H / 6.0); 
                }

                float S = (M > 0) ? C / M : 0;
                float V = M;
                return float3(H, S, V);
            }

            
            float3 hsv2rgb(float3 hsv)
            {
                float H = hsv.x * 6.0;  
                float S = hsv.y;
                float V = hsv.z;

                float C = V * S;
                float X = C * (1.0 - abs(fmod(H, 2.0) - 1.0));
                float3 rgb = (H < 1) ? float3(C, X, 0) :
                             (H < 2) ? float3(X, C, 0) :
                             (H < 3) ? float3(0, C, X) :
                             (H < 4) ? float3(0, X, C) :
                             (H < 5) ? float3(X, 0, C) :
                                       float3(C, 0, X);

                float m = V - C;
                return rgb + m;
            }

           
            float3 adjustContrast(float3 color, float contrast)
            {
                float midGray = 0.5;
                return saturate(lerp(midGray, color, 1.0 + contrast));
            }

            v2f vert(appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, v2f o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;

                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                float4 texColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(i.uv)) * _Color;

                float3 hsv = rgb2hsv(texColor.rgb);

                
                hsv.x = frac(hsv.x + _Hue); 
                hsv.y = clamp(hsv.y + _Saturation, 0.0, 1.0);
                hsv.z = clamp(hsv.z + _Brightness, 0.0, 1.0);

                float3 rgb = hsv2rgb(hsv);

                
                rgb = adjustContrast(rgb, _Contrast);

                return float4(rgb, texColor.a);
            }

            ENDCG
        }
    }
    FallBack "Diffuse"
}
