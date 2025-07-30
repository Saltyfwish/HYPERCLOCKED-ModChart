Shader "BeatSaber/XYOffset"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _XOffset ("X Offset", Range(-0.5, 0.5)) = 0
        _YOffset ("Y Offset", Range(-0.5, 0.5)) = 0
        _Scale ("Scale", Range(0.1, 10)) = 1
        _RotationAngle ("Rotation Angle", Range(0, 360)) = 0
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

            float _XOffset;
            float _YOffset;
            float _Scale;
            float _RotationAngle;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
               
                o.uv = v.uv - 0.5;
                return o;
            }

            sampler2D _MainTex;
            half4 _MainTex_ST;

            fixed4 frag (v2f i) : SV_Target
            {
                float2 uv = i.uv;

                
                uv.x -= _XOffset * 0.5;
                uv.y -= _YOffset * 0.5;

                
                uv *= _Scale;

                
                float angle = radians(_RotationAngle);
                float2 rotatedUV;
                rotatedUV.x = uv.x * cos(angle) - uv.y * sin(angle);
                rotatedUV.y = uv.x * sin(angle) + uv.y * cos(angle);
                uv = rotatedUV;

                
                if (uv.x < -0.5 || uv.x > 0.5 || uv.y < -0.5 || uv.y > 0.5) {
                    return fixed4(0, 0, 0, 1); 
                }

                fixed4 color = tex2D(_MainTex, UnityStereoScreenSpaceUVAdjust(uv + 0.5, _MainTex_ST)); 

                return color;
            }
            ENDCG
        }
    }
}