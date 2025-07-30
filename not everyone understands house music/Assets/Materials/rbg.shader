Shader "Custom/VRMeshSplitRGB_Glow_Move"
{
    Properties
    {
        _MainTex("Texture", 2D) = "white" {}
        _SplitAmount("Split Amount", Range(0, 1)) = 0.0 // Controls gap size
        _ColorR("Red", Range(0, 1)) = 1.0
        _ColorG("Green", Range(0, 1)) = 1.0
        _ColorB("Blue", Range(0, 1)) = 1.0
        _Glow("Glow Intensity", Range(0, 1)) = 1.0 // Alpha channel for Beat Saber glow
        _MoveZ("Move Z", Range(-1.0, 1.0)) = 0.0 // Controls forward/backward movement
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

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _SplitAmount;
            float _ColorR;
            float _ColorG;
            float _ColorB;
            float _Glow; // Alpha channel for glow
            float _MoveZ; // Move mesh forward or backward

            v2f vert(appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                v2f o;
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                float3 localPos = v.vertex.xyz;

                // Split mesh from center
                if (localPos.x > 0.0) // Right half
                {
                    localPos.x += _SplitAmount;
                }
                else if (localPos.x < 0.0) // Left half
                {
                    localPos.x -= _SplitAmount;
                }

                // Move the mesh forward or backward on the Z-axis
                localPos.z += _MoveZ;

                v.vertex.xyz = localPos;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv);

                // Apply RGB controls
                col.rgb *= float3(_ColorR, _ColorG, _ColorB);

                // Set the alpha channel as glow intensity (used by Beat Saber)
                col.a = _Glow;

                // Create the see-through gap in the middle
                if (abs(i.uv.x - 0.5) < (_SplitAmount * 0.5))
                {
                    discard; // Make the center transparent
                }

                return col;
            }
            ENDCG
        }
    }
}