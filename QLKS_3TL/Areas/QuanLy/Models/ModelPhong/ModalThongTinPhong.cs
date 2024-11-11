namespace QLKS_3TL.Areas.QuanLy.Models.ModelPhong
{
    public class ModalThongTinPhong
    {
        public string MaPhong { get; set; } = null!;
        public string? MaHangPhong { get; set; }
        public string? TenHangPhong { get; set; }
        public decimal? GiaHangPhong { get; set; }
        public string? MoTaHangPhong { get; set; }
        public string? AnhHangPhong { get; set; }
        public int? SoGiuong { get; set; }  // Thêm số giường
        public double? DienTich { get; set; }  // Thêm diện tích
    }
}
