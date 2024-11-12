$(document).ready(function () {
    //tìm kiếm tài khoản 
    $('#timKiemKhachHang').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#bodyThongTinKhachHang tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });
});

//hiển thị chi tiét
function ChiTietKhachHang(maKhachHang) {
    // Xác thực mã khách hàng
    if (!maKhachHang) {
        alert('Mã khách hàng không hợp lệ.');
        return;
    }

    // Đường dẫn đến phương thức trong controller để lấy thông tin
    const baseUrl = '/QuanLy/QuanLyKhachHang/ChiTietKhachHang/';

    $.ajax({
        url: baseUrl + maKhachHang, // Tạo URL
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const khachHang = response.data;
                const datPhong = khachHang.datPhongs; // Lấy thông tin đặt phòng (object)

                // Tạo HTML hiển thị thông tin khách hàng
                const object = `
                    <div class="container">
                        <div class="row mt-2">
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Họ tên: </span>${khachHang.hoTen || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Số điện thoại: </span>${khachHang.soDienThoai || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                
                                <h6><span style="font-weight: 600;">Email: </span>${khachHang.email || 'N/A'}</h6>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">CCCD: </span>${khachHang.cccd || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Giới tính: </span>${khachHang.gioiTinh || 'N/A'}</h6>
                            </div>
                             <div class="col-4">
                                <h6><span style="font-weight: 600;">Hạng phòng: </span>${datPhong?.hangPhong1 || 'N/A'}</h6>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Ngày nhận: </span>${datPhong?.ngayNhan || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Ngày trả: </span>${datPhong?.ngayTra || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Tổng số ngày: </span>${datPhong?.tongSoNgay || 'N/A'}</h6>
                            </div>
                        </div>
                        <div class="row mt-2">
                           
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Tên phòng: </span>${datPhong?.tenPhong || 'N/A'}</h6>
                            </div>
                            <div class="col-4">
                                <h6><span style="font-weight: 600;">Thanh toán: </span>${datPhong?.thanhToan?.toLocaleString() || '0'} VND</h6>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <h6><span style="font-weight: 600;">Yêu cầu: </span>${datPhong?.yeuCau || 'N/A'}</h6>
                        </div>
                    </div>
                `;

                $('#thongTinKhachHangChiTiet').html(object);
                $('#ThongtinKhachHang').modal('show'); // Hiển thị modal
            } else {
                // Hiển thị thông báo cho lỗi từ server
                alert(response.message || 'Đã xảy ra lỗi khi lấy thông tin khách hàng.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin khách hàng:', textStatus, errorThrown);
            alert('Không thể lấy thông tin khách hàng. Vui lòng kiểm tra lại.');
        }
    });
}
