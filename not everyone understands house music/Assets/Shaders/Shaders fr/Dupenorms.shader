Shader "Custom/InsideOutSphereWithDuplication"
{
    Properties
    {
        _MainTex ("Camera Render Texture", 2D) = "white" {}
        _DuplicationAmount ("Duplication Amount", Range(1, 100)) = 1
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Cull Back 

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
                float3 normal : TEXCOORD1;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            sampler2D _MainTex;
            float _DuplicationAmount;
            v2f vert (appdata v)
            {
                v2f o;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                o.normal = -v.normal;

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                
                float2 duplicationUV = i.uv * _DuplicationAmount;
                duplicationUV -= floor(duplicationUV); 

                
                fixed4 col = tex2D(_MainTex, duplicationUV);
                return col;
            }
            ENDCG
        }
    }
}
