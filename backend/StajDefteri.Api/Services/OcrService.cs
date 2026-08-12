using Tesseract;

namespace StajDefteri.Api.Services;

public class OcrService
{
    public static string MetinCikar(string dosyaYolu)
    {
        try
        {
            using var engine = new TesseractEngine("tessdata", "tur", EngineMode.Default);
            using var img = Pix.LoadFromFile(dosyaYolu);
            using var page = engine.Process(img);

            return page.GetText().Trim();
        }
        catch (Exception ex)
            {
                Serilog.Log.Warning(ex, "OCR başarısız");
                return "";
            }
    }
}