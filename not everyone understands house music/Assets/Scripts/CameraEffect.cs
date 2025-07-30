using UnityEngine;

[ExecuteInEditMode]
[RequireComponent(typeof(Camera))]
public class CameraEffect : MonoBehaviour
{
    public Material material;

    private void OnRenderImage(RenderTexture source, RenderTexture destination)
    {
        if (material == null)
        {
            Graphics.Blit(source, destination);
            return;
        }

        if (UnityEngine.XR.XRSettings.enabled && UnityEngine.XR.XRSettings.stereoRenderingMode == UnityEngine.XR.XRSettings.StereoRenderingMode.SinglePass)
        {
            RenderTextureDescriptor descriptor = source.descriptor;
            descriptor.width /= 2; // Adjust width for single pass rendering

            RenderTexture rt = RenderTexture.GetTemporary(descriptor);
            Graphics.Blit(source, rt, material, 0); // Pass the material index explicitly

            // Blit the result for each eye
            Graphics.Blit(rt, destination); // Left eye
            Graphics.Blit(rt, destination, material, 1); // Right eye

            RenderTexture.ReleaseTemporary(rt);
        }
        else
        {
            Graphics.Blit(source, destination, material);
        }
    }
}
