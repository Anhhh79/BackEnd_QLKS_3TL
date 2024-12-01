namespace QLKS_3TL.Areas.KhachHang.Models
{
    public class TimKiemThongTinViewModel
    {
        public DateOnly? NgayNhan { get; set; }
        public DateOnly? NgayTra { get; set; }
        public int? SoGiuong { get; set; }
        public decimal? MucGiaMin { get; set; }
        public decimal? MucGiaMax { get; set; }
        public string? MaHangPhong { get; set; }
    }
}
