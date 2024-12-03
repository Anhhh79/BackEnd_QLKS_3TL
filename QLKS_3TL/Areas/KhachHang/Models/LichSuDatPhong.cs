namespace QLKS_3TL.Areas.KhachHang.Models
{
    public class LichSuDatPhong
    {
        public DateTime? ThoiGianDat { get; set; }  // Thời gian đặt phòng
        public string? HoTen { get; set; }           // Họ tên khách hàng
        public string? SoDienThoai { get; set; }    // Số điện thoại khách hàng
        public string? MaPhong { get; set; }        // Mã phòng
        public string? TenHangPhong { get; set; }   // Tên hạng phòng
        public DateOnly? NgayNhan { get; set; }    // Ngày nhận phòng
        public DateOnly? NgayTra { get; set; }     // Ngày trả phòng
        public decimal? TongThanhToan { get; set; } // Tổng thanh toán
    }
}
