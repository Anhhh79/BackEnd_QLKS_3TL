namespace QLKS_3TL.Areas.KhachHang.Models
{
    public class DatPhongViewModel
    {
        public string FullName { get; set; }
        public string Sex { get; set; }
        public string CCCD { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public string AdditionalRequest { get; set; }
        public string MaHangPhong { get; set; }
        public string TenHangPhong { get; set; }
        public string NgayNhan { get; set; }
        public string NgayTra { get; set; }
        public int SoLuongPhong { get; set; }
        public decimal TongThanhToan { get; set; }
    }
}
