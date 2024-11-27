namespace QLKS_3TL.Areas.LeTan.Models
{
    public class ThongTinDatPhongViewModel
    {
        public string MaDatPhong { get; set; } // Mã đặt phòng (nếu có, dùng để xác định giao dịch)

        public string MaKhachHang { get; set; } // Mã khách hàng (khách thực hiện việc đặt phòng)

        public string MaHangPhong { get; set; } // Mã hạng phòng (loại phòng đặt)

        public int SoLuongPhong { get; set; } // Số lượng phòng khách hàng đặt

        public List<string> DanhSachPhong { get; set; } // Danh sách các phòng đã chọn (mã phòng)

        public DateOnly? NgayNhan { get; set; } // Ngày nhận phòng (tùy chọn)

        public DateOnly? NgayTra { get; set; } // Ngày trả phòng (tùy chọn)

        public string YeuCauThem { get; set; } // Các yêu cầu thêm từ khách hàng (ví dụ: yêu cầu phòng hút thuốc, không gian yên tĩnh,...)

        public decimal TongThanhToan { get; set; } // Tổng thanh toán cho việc đặt phòng

        // Có thể thêm các thuộc tính khác tùy vào yêu cầu của hệ thống.
    }

}
