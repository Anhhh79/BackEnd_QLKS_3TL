function loadHangPhong(roomCode) {
    $.ajax({
        url: '/KhachHang/DatPhongOnl/ModalDP',
        type: 'GET',
        data: { maHangPhong: roomCode },
        success: function (data) {

            // Kiểm tra xem dữ liệu có tồn tại không
            if (data) {
                $('#tenHP').text(data.tenHangPhong); // Chú ý tên trường
                $('#maHP').val(data.maHangPhong); // Chú ý tên trường
                $('#giaHP').text(data.giaHangPhong + 'VND'); // Chú ý tên trường

                // Hiển thị modal
                $('#Datphong').modal('show');
            } else {
                alert("Không tìm thấy dữ liệu cho hạng phòng này.");
            }
        },
        error: function () {
            alert("Có lỗi xảy ra khi tải thông tin hạng phòng.");
        }
    });
}


// Thêm event listener cho nút "Chọn Phòng"
// Lấy giá trị từ dropdown khi người dùng thay đổi
let soLuong = $("#SelectSL").val(); // Lấy giá trị từ dropdown

$("#SelectSL").change(function () {
    // Cập nhật lại giá trị của soLuong khi thay đổi dropdown
    soLuong = $(this).val();
    console.log("Số lượng thay đổi:", soLuong);
});

document.getElementById("ChonDP").addEventListener("click", function () {
    const ngayNhan = document.getElementById("NgayNhan").value; // Giá trị từ input
    const ngayTra = document.getElementById("NgayTra").value;

    // Kiểm tra ngày nhận và ngày trả không được để trống
    if (!ngayNhan || !ngayTra) {
        alert("Vui lòng chọn cả ngày nhận và ngày trả!");
        return;
    }

    // Chuyển định dạng ngày sang chuẩn ISO (YYYY-MM-DD)
    const [ngayNhanFormatted, ngayTraFormatted] = [ngayNhan, ngayTra].map(dateStr => {
        const [day, month, year] = dateStr.split("-"); // Tách theo dấu "-"
        return `${year}-${month}-${day}`; // Chuyển thành YYYY-MM-DD
    });

    // Chuyển thành đối tượng Date để so sánh
    const checkNgayNhan = new Date(ngayNhanFormatted);
    const checkNgayTra = new Date(ngayTraFormatted);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Chỉ so sánh ngày, bỏ qua giờ

    // Kiểm tra ngày nhận không được trước ngày hiện tại
    if (checkNgayNhan < today) {
        alert("Ngày nhận không thể trước ngày hiện tại!");
        return;
    }

    // Kiểm tra ngày trả phải sau ngày nhận ít nhất 1 ngày
    if (checkNgayTra <= checkNgayNhan) {
        alert("Ngày trả phải sau ngày nhận ít nhất 1 ngày!");
        return;
    }

    // Lấy thông tin từ các trường khác
    const tenHangPhong = document.getElementById("tenHP").textContent;
    const maHangPhong = document.getElementById("maHP").value;
    const giaHangPhong = document.getElementById("giaHP").textContent;

    // Tạo đối tượng dữ liệu cho phòng đã chọn
    const bookingData = {
        maHangPhong: maHangPhong,
        tenHangPhong: tenHangPhong,
        ngayNhan: ngayNhan,
        ngayTra: ngayTra,
        giaHangPhong: giaHangPhong,
        soLuong: soLuong
    };

    // Lấy dữ liệu cũ từ sessionStorage (nếu có)
    let allBookings = JSON.parse(sessionStorage.getItem("allBookings")) || [];

    // Thêm booking mới vào mảng dữ liệu
    allBookings.push(bookingData);

    // Lưu lại dữ liệu mới vào sessionStorage
    sessionStorage.setItem("allBookings", JSON.stringify(allBookings));

    // Hiển thị thông báo thành công và đóng modal
    alert("Chọn phòng thành công!");
    $('#Datphong').modal('hide');
    location.reload();
});


document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu booking từ sessionStorage
    let allBookings = JSON.parse(sessionStorage.getItem("allBookings")) || [];

    // Kiểm tra nếu có dữ liệu
    if (allBookings.length > 0) {
        // Lặp qua tất cả bookings và tạo nội dung HTML tương ứng
        allBookings.forEach(function (booking, index) {
            // Chuyển giá từ chuỗi (ví dụ: "1,800,000 VND") thành số
            let price = parseInt(booking.giaHangPhong.replace(/[^0-9]/g, "")); // Xóa tất cả ký tự không phải số

            // Định dạng giá theo kiểu VND với dấu phân cách hàng nghìn
            let formattedPrice = price.toLocaleString('vi-VN') + " VND";  // Định dạng với tiền tệ VND

            // Tạo phần tử div cho mỗi booking
            let bookingHTML = `
                <div class="mt-3 mx-2 Datphong-hover" data-index="${index}">
                    <div class="d-flex align-items-center">
                        <h6 class="d-flex me-2 mb-0">Hạng phòng:</h6><span>${booking.tenHangPhong}</span>
                    </div>
                    <div class="d-flex mt-2">
                        <div class="d-flex">
                            <h6 class="mb-0 mt-1">Ngày nhận: </h6>
                            <div class="ms-1">${booking.ngayNhan}</div>
                        </div>
                        <div class="d-flex" style="margin-left: 50px;">
                            <h6 class="mb-0 mt-1">Ngày trả: </h6>
                            <div class="ms-1">${booking.ngayTra}</div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-1">
                        <h6 class="d-flex me-2 mb-0">Số lượng:</h6><span>${booking.soLuong}</span>
                    </div>
                    <div class="d-flex align-items-center mt-1">
                        <div class="col-6">
                            <h6 class="me-2 mb-0" style="display: inline;">Giá:</h6>
                            <span class="text-color textTitleRoom">${formattedPrice}</span>
                        </div>
                        <div class="d-flex mt-1 justify-content-end col-6">
                            <button type="button" class="btn btn-danger btn-huy" style="font-size: smaller;">
                                Hủy
                            </button>
                        </div>
                    </div>
                    <hr>
                </div>
            `;
            // Thêm nội dung vào phần tử chứa thông tin booking
            document.getElementById('bookingList').innerHTML += bookingHTML;
        });
    } else {
        // Nếu không có dữ liệu, có thể hiển thị thông báo hoặc để trống
        document.getElementById('bookingList').innerHTML = "<p>Không có thông tin đặt phòng.</p>";
    }

    // Thêm event listener cho tất cả các nút "Hủy"
    document.querySelectorAll('.btn-huy').forEach(function (button) {
        button.addEventListener('click', function () {
            // Lấy chỉ mục của booking cần xóa từ thuộc tính data-index
            let bookingIndex = this.closest('.Datphong-hover').getAttribute('data-index');
            // Xóa booking tương ứng khỏi sessionStorage
            allBookings.splice(bookingIndex, 1); // Loại bỏ booking theo chỉ mục

            // Cập nhật lại sessionStorage
            sessionStorage.setItem("allBookings", JSON.stringify(allBookings));

            // Xóa phần tử HTML tương ứng
            this.closest('.Datphong-hover').remove();

            // Hiển thị thông báo
            alert("Đã hủy chọn phòng!");
        });
    });
});


function calculateTotalFromSessionStorage() {
    // Lấy dữ liệu từ sessionStorage
    const data = sessionStorage.getItem("allBookings");

    if (!data) {
        document.getElementById('TTTongCong').textContent = "0 VND";
        return;
    }

    // Parse dữ liệu từ JSON
    const bookingData = JSON.parse(data);

    let total = 0;

    // Tính tổng số tiền
    bookingData.forEach(item => {
        const price = parseFloat(item.giaHangPhong.replace(/[^\d]/g, '')); // Chỉ lấy phần số từ giá
        const quantity = parseInt(item.soLuong, 10); // Chuyển số lượng sang số nguyên

        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });

    const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);

    // Thay đổi ký hiệu tiền tệ từ ₫ thành VND
    const formattedWithVND = formattedTotal.replace('₫', 'VND');

    // Hiển thị tổng số tiền vào phần tử có id "TTTongCong"
    document.getElementById('TTTongCong').textContent = formattedWithVND;
}

// Gọi hàm để tính và hiển thị tổng
calculateTotalFromSessionStorage();
