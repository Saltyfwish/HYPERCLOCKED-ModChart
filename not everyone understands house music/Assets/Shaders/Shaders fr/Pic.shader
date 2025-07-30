Shader "Hidden/Old"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Old1 ("Old1", 2D) = "" {}
        _Old2 ("Old2", 2D) = "" {}
        _Old3 ("Old3", 2D) = "" {}
        _Old4 ("Old4", 2D) = "" {}
        _1 ("Show 1", Range(0, 1)) = 0
        _2 ("Show 2", Range(0, 1)) = 0
        _3 ("Show 3", Range(0, 1)) = 0
        _4 ("4", Range(0, 1)) = 0
        _CropLeft ("Crop Left", Range(0, 0.5)) = 0
        _CropRight ("Crop Right", Range(0, 0.5)) = 0
        _ZMove ("Z Move", Float) = 0 
    }
    SubShader
    {
        Tags {
            "RenderType"="Opaque"
        }

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

                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;

                UNITY_VERTEX_OUTPUT_STEREO
            };

            float _ZMove;

            v2f vert (appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                v.vertex.z += _ZMove; 
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;

                return o;
            }

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Old1);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Old2);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Old3);
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Old4);
            float _1;
            float _2;
            float _3;
            float _4;
            float _CropLeft;
            float _CropRight;

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                
                if (i.uv.x < _CropLeft || i.uv.x > 1.0 - _CropRight)
                    discard;

                return 
                    UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Old1, UnityStereoTransformScreenSpaceTex(i.uv)) * _1 +
                    UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Old2, UnityStereoTransformScreenSpaceTex(i.uv)) * _2 +
                    UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Old3, UnityStereoTransformScreenSpaceTex(i.uv)) * _3 +
                    UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Old4, UnityStereoTransformScreenSpaceTex(i.uv)) * _4;
            }
            ENDCG
        }
    }
}
