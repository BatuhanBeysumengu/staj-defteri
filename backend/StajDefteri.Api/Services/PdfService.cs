using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using StajDefteri.Api.Models;

namespace StajDefteri.Api.Services;

public class PdfService
{
    public static byte[] KayitlarPdf(string ogrenciAd, List<DefterKaydi> kayitlar)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(11));

                // Başlık
                page.Header().Column(col =>
                {
                    col.Item().Text("Staj Defteri").FontSize(20).Bold();
                    col.Item().Text($"Öğrenci: {ogrenciAd}").FontSize(12);
                    col.Item().Text($"Tarih: {DateTime.Now:dd.MM.yyyy}").FontSize(10)
                        .FontColor(Colors.Grey.Medium);
                });

                page.Content().PaddingVertical(1, Unit.Centimetre).Column(col =>
                {
                    col.Spacing(10);

                    foreach (var kayit in kayitlar)
                    {
                        col.Item().Border(1).BorderColor(Colors.Grey.Lighten2)
                            .Padding(10).Column(k =>
                        {
                            k.Item().Text($"{kayit.Tarih:dd.MM.yyyy} · {kayit.Durum}")
                                .FontSize(10).FontColor(Colors.Grey.Medium);
                            k.Item().Text(kayit.Icerik);
                        });
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }
}