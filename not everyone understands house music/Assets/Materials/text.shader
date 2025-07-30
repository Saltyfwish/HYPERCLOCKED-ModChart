Shader "Custom/FakeGlowSplit"
{
    Properties
    {
        _MainTex("Texture", 2D) = "white" {}
        _SplitAmount("Split Amount", Range(0, 1)) = 0.0
        _GlowColor("Glow Color", Color) = (1, 0.8, 0.5, 1)
        _GlowStrength("Glow Strength", Range(0, 10)) = 4.0
        _GlowSize("Glow Size", Range(-1, 3)) = 1.5
        _MoveZ("Move Z", Range(-1.0, 1.0)) = 0.0
        _Transparency("Transparency", Range(0,1)) = 1.0
    }

    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" }
        ZWrite Off
        Cull Off
        Blend SrcAlpha OneMinusSrcAlpha

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            #pragma multi_compile _ STEREO_INSTANCING_ON

            #include "UnityCG.cginc"

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
                float4 worldPos : TEXCOORD1;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _SplitAmount;
            float4 _GlowColor;
            float _GlowStrength;
            float _GlowSize;
            float _MoveZ;
            float _Transparency;

            v2f vert(appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                v2f o;
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                float3 localPos = v.vertex.xyz;

                // Apply split
                if (localPos.x > 0.0) localPos.x += _SplitAmount;
                else if (localPos.x < 0.0) localPos.x -= _SplitAmount;

                // Move in Z
                localPos.z += _MoveZ;

                v.vertex.xyz = localPos;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                float2 centerUV = float2(0.5, 0.5);
                float2 offsetUV = (i.uv - centerUV) * _GlowSize + centerUV;

                fixed4 glowTex = tex2D(_MainTex, offsetUV);
                fixed4 coreTex = tex2D(_MainTex, i.uv);

                if (coreTex.a < 0.01)
                    discard;

                if (abs(i.uv.x - 0.5) < (_SplitAmount * 0.5))
                    discard;

                fixed4 glow = _GlowColor * glowTex.a * _GlowStrength;
                glow.a = glowTex.a * (_GlowStrength * 0.1); // soft alpha

                fixed4 result = glow + coreTex;
                result.a = saturate((glow.a + coreTex.a) * _Transparency);
                return result;
            }
            ENDCG
        }
    }
}
