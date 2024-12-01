$(document).ready(function () {
    $('#inseachTTDP').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#TbodyTTDP tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });
});
function loadBookingDetails(button) {
    const bookingId = $(button).data('madatphong'); // Lấy mã đặt phòng từ data-madatphong
    console.log("Mã đặt phòng:", bookingId); // Kiểm tra giá trị mã đặt phòng

    $.ajax({
        url: '/LeTan/XacNhanDatPhong/GetBookingDetails', // URL API của bạn
        type: 'GET',
        data: { maDatPhong: bookingId },
        success: function (data) {
            console.log(data); // Kiểm tra dữ liệu nhận được

            // Cập nhật các trường trong modal
            $("#HoTen").text(data.hoTen || "N/A");
            $("#SoDienThoai").text(data.soDienThoai || "N/A");
            $("#GioiTinh").text(data.gioiTinh || "N/A");
            $("#CCCD").text(data.cccd || "N/A");
            $("#NgayNhan").text(data.ngayNhan || "N/A");
            $("#NgayTra").text(data.ngayTra || "N/A");
            $("#Email").text(data.email || "N/A");
            $("#SoLuongPhong").text(data.soLuongPhong || "N/A");
            $("#HangPhong").text(data.tenHangPhong || "N/A");
            $("#TongThanhToan").text(data.tongThanhToan ? `${data.tongThanhToan} VND` : "0 VND");
            $("#YeuCauThem").text(data.yeuCauThem || "Không có yêu cầu");

            // Xử lý danh sách phòng
            const roomList = $("#DanhSachPhong");
            roomList.empty(); // Xóa danh sách cũ trước khi thêm

            let roomCount = 0; // Đếm số phòng đã chọn

            data.phongs.forEach(room => {
                roomList.append(`
                    <div class="row">
                        <div class="col-6">${room}</div>
                        <div class="col-6 d-flex justify-content-end">
                            <input type="checkbox" class="room-checkbox" name="checkboxGroup" style="transform: scale(1.4);" class="cusor" value="${room}">
                        </div>
                    </div>
                `);
            });

            // Đảm bảo số lượng phòng không vượt quá số lượng người dùng đã đặt
            const maxRoomCount = data.soLuongPhong;

            // Lắng nghe sự kiện khi chọn phòng 
            $(".room-checkbox").on('change', function () {
                const selectedRooms = $(".room-checkbox:checked").length;
                if (selectedRooms > maxRoomCount) {
                    // Nếu số phòng đã chọn lớn hơn số phòng đã đặt, thông báo và bỏ chọn phòng vừa chọn
                    alert(`Bạn chỉ được chọn tối đa ${maxRoomCount} phòng.`);
                    $(this).prop('checked', false);
                }
            });

            // Hiển thị modal
            $("#XacNhan1").modal("show");
        },
        error: function () {
            alert("Có lỗi xảy ra khi tải dữ liệu.");
        }
    });
}

    document.getElementById("btnHoanTat").addEventListener("click", function () {
        // Lấy số lượng phòng từ span trong modal
        const soLuongPhong = parseInt(document.getElementById("SoLuongPhong").innerText);
        const danhSachPhong = [];
        const selectedRooms = document.querySelectorAll(".room-checkbox:checked");

        // Kiểm tra nếu không có phòng nào được chọn
        if (selectedRooms.length === 0) {
            alert("Vui lòng chọn ít nhất một phòng.");
            return;
        }

        // Lấy danh sách các phòng đã chọn và thêm vào mảng danhSachPhong
        selectedRooms.forEach(function (room) {
            danhSachPhong.push(room.value);
        });

        // Kiểm tra số lượng phòng đã chọn
        if (soLuongPhong === 1 && danhSachPhong.length !== 1) {
            alert("Vui lòng chọn 1 phòng.");
            return;
        } else if (soLuongPhong > 1 && danhSachPhong.length !== soLuongPhong) {
            alert("Vui lòng chọn đúng số lượng phòng.");
            return;
        }

        // Lấy các thông tin từ các thẻ span trong modal (ngày nhận, ngày trả, tổng thanh toán,...)
        const maDatPhong = document.getElementById("maDatPhong").value;  // Lấy từ input hidden
        const maKhachHang = document.getElementById("maKhachHang").value;  // Lấy từ input hidden
        const maHangPhong = document.getElementById("maHangPhong").value; // Mã hạng phòng
        const ngayNhan = document.getElementById("NgayNhan").innerText;
        const ngayTra = document.getElementById("NgayTra").innerText;
        const yeuCauThem = document.getElementById("YeuCauThem").innerText;
        const tongThanhToan = parseFloat(document.getElementById("TongThanhToan").innerText);

        console.log(maKhachHang);
        console.log(maHangPhong);
        console.log(maDatPhong);
        console.log(danhSachPhong);
        // Gửi dữ liệu thông qua AJAX
        $.ajax({
            url: '/LeTan/XacNhanDatPhong/XuLyThongTinDatPhong',  // Địa chỉ API xử lý
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                MaDatPhong: maDatPhong,
                MaKhachHang: maKhachHang,
                MaHangPhong: maHangPhong,
                SoLuongPhong: soLuongPhong,
                DanhSachPhong: danhSachPhong,
                NgayNhan: ngayNhan, // Đảm bảo định dạng ngày đúng, ví dụ "2024-12-01"
                NgayTra: ngayTra,   // Đảm bảo định dạng ngày đúng
                YeuCauThem: yeuCauThem,
                TongThanhToan: tongThanhToan
            }),
            success: function (response) {
                console.log(response);  // Đoạn này giúp debug kết quả trả về từ server
                if (response.success) {
                    alert('Cập nhật thành công!');
                    $('#XacNhan1').modal('hide');  // Đóng modal khi cập nhật thành công

                    location.reload();
                } else {
                    alert('Cập nhật thành công!');
                    $('#XacNhan1').modal('hide');  // Đóng modal khi cập nhật thành công

                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                console.error("Response Text:", xhr.responseText);
                alert('Đã có lỗi xảy ra! Vui lòng kiểm tra kết nối hoặc thử lại sau.');
            }
        });
    });