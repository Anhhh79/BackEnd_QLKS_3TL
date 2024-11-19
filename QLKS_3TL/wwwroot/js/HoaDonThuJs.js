$(document).ready(function () {
    //tìm kiếm tài khoản 
    $('#timKiemHoaDonThu').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#bodyThongTinHoaDonThu tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });
});
// Hàm load thông tin hóa đơn và hiển thị trong modal
function loadHoaDonThu(maHoaDon) {
    // Gửi AJAX request để lấy thông tin hóa đơn
    const baseUrl = `/QuanLy/QuanLyHoaDonThu/ChiTietHoaDonThu/`
    $.ajax({
        url: baseUrl + maHoaDon, // URL endpoint để lấy dữ liệu
        type: 'GET',
        data: { id: maHoaDon },
        success: function (response) {
            if (response.success) {
                // Dữ liệu trả về
                const hoaDon = response.data;
                console.log(hoaDon);
                // Tạo HTML cho modal
                const object = `
                <div class="container" >
                    <div class="row mt-2">
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Mã hóa đơn:</span> ${hoaDon.maHoaDonThu}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Mã hạng phòng:</span> ${hoaDon.maHangPhong}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Mã phòng:</span> ${hoaDon.maPhong ?? 'Không xác định'}</h6>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Người xuất:</span> ${hoaDon.tenNhanVien}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Khách hàng:</span> ${hoaDon.tenKhachHang}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Thời gian:</span> ${formatDate(hoaDon.thoiGian)}</h6>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Ngày nhận:</span> ${formatDate(hoaDon.ngayNhan)}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Ngày trả:</span> ${formatDate(hoaDon.ngayTra)}</h6>
                        </div>
                        <div class="col-4">
                            <h6><span style="font-weight: 600;">Tổng giá trị:</span> ${hoaDon.tongGia} VND</h6>
                        </div>
                    </div>
                </div>
                `;

                // Gắn HTML vào modal
                $('#hoaDonThuContent').html(object);

                // Hiển thị modal
                $('#chiTietHoaDonThu').modal('show');
            } else {
                alert(response.message || 'Không tìm thấy thông tin hóa đơn.');
            }
        },
        error: function () {
            alert('Đã xảy ra lỗi khi tải thông tin hóa đơn.');
        }
    });
}

// Hàm format ngày (tùy chọn)
function formatDate(dateString) {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
