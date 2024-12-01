namespace QLKS_3TL.Areas.KhachHang.Models
{
    public class HangPhongModel
    {
        public string MaHangPhong { get; set; } = null!; // "null!" để bỏ qua cảnh báo của nullable reference type

        public string? TenHangPhong { get; set; }

        public decimal? GiaHangPhong { get; set; }

        public int? SoGiuong { get; set; }

        public double? DienTich { get; set; }

        public string? AnhHangPhong { get; set; }

        public string? MoTa { get; set; }
    }
}
