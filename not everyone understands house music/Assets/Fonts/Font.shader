Shader "Custom/GUIText_BeatSaber"
{
    Properties
    {
        _MainTex ("Font Texture", 2D) = "white" {}
        _ColorR ("Red", Range(0, 1)) = 1.0
        _ColorG ("Green", Range(0, 1)) = 1.0
        _ColorB ("Blue", Range(0, 1)) = 1.0
        _Glow ("Glow Intensity", Range(0, 10)) = 1.0
        _Smoothness ("Edge Smoothness", Range(0.001, 0.2)) = 0.001
        _Threshold ("Alpha Threshold", Range(0, 1)) = 0.279
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" }

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            #pragma multi_compile _ STEREO_INSTANCING_ON
            #include "UnityCG.cginc"

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _ColorR;
            float _ColorG;
            float _ColorB;
            float _Glow;
            float _Smoothness;
            float _Threshold;

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float4 vertex : SV_POSITION;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            v2f vert(appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                v2f o;
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                fixed4 tex = tex2D(_MainTex, i.uv);

                float alpha = smoothstep(_Threshold - _Smoothness, _Threshold + _Smoothness, tex.a);

                if (alpha <= 0.001)
                    discard;

                float3 color = float3(_ColorR, _ColorG, _ColorB) * alpha;
                return fixed4(color, alpha * _Glow);
            }
            ENDCG
        }
    }
}
