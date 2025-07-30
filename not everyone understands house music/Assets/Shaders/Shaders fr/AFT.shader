Shader "Custom/AFT"
{
    Properties
    {
        _PreviousFrameTex ("Previous Frame Texture", 2D) = "white" {}
        _TrailOpacity ("Trail Opacity", Range(0, 1)) = 0.5
        _FadeSpeed ("Fade Speed", Range(0.1, 5.0)) = 1.0
    }
    SubShader
    {
        Tags { "Queue" = "Overlay" "RenderType" = "Transparent" }
        Pass
        {
            ZWrite Off
            Blend SrcAlpha OneMinusSrcAlpha
            Cull Off

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            #pragma multi_compile _ UNITY_SINGLE_PASS_STEREO

            #include "UnityCG.cginc"

            sampler2D _PreviousFrameTex;
            float _TrailOpacity;
            float _FadeSpeed;

            struct appdata_t
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float2 uv : TEXCOORD0;
            };

            v2f vert(appdata_t v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            half4 frag(v2f i) : SV_Target
            {
                
                half4 prevFrameColor = tex2D(_PreviousFrameTex, i.uv);

                
                prevFrameColor.a *= _FadeSpeed;

                
                half4 blendedColor = lerp(prevFrameColor, prevFrameColor, _TrailOpacity);

                return blendedColor;
            }
            ENDHLSL
        }
    }
}
