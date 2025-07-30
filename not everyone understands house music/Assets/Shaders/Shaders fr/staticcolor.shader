Shader "BeatSaber/Static"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Amount ("Amount", Range(0, 1)) = 1.0
        _Cut ("Cut", Range(0, 1)) = 0.5
        _Seed ("Seed", Range(0, 1)) = 0.0
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
                
                UNITY_VERTEX_INPUT_INSTANCE_ID 
            };
            
           
            
            struct v2f
            {
            
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
                
                UNITY_VERTEX_OUTPUT_STEREO 
            };
            
            v2f vert (appdata v)
            {
                v2f o;
                
                UNITY_SETUP_INSTANCE_ID(v); 
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o); 
                
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex); 
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Notes);

            float _Amount;
            float _Cut;
            float _Seed;

            float4 _MainTex_TexelSize;

            fixed4 frag (v2f i) : SV_Target
            {   
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i); 
                fixed4 color = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(i.uv));
                fixed4 note = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, UnityStereoTransformScreenSpaceTex(i.uv)); 

                note += UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, i.uv + _MainTex_TexelSize.xy * float2( 10,  0));
                note += UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, i.uv + _MainTex_TexelSize.xy * float2(-10,  0));
                note += UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, i.uv + _MainTex_TexelSize.xy * float2( 20,  0));
                note += UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, i.uv + _MainTex_TexelSize.xy * float2(-20,  0));

                i.uv.y = floor(i.uv.y*300.0);

                // note = step(0.01, note.r+note.b);
                note.r *= step(frac(sin((_Seed+69.69+i.uv.x*0.001)*78.233*(i.uv.y+0.1))*43758.5453123), _Cut);
                note.g *= step(frac(cos((_Seed+42.04+i.uv.x*0.001)*78.233*(i.uv.y+0.1))*43758.5453123), _Cut);
                note.b *= step(frac(tan((_Seed+13.37+i.uv.x*0.001)*78.233*(i.uv.y+0.1))*43758.5453123), _Cut);
                note.rgb *= _Amount;
                color *= 1.0-note;

                return color;
            }
            ENDCG
        }
    }
}