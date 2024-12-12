document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu booking từ sessionStorage
    let allBookings = JSON.parse(sessionStorage.getItem("allBookings")) || [];

    // Kiểm tra nếu có dữ liệu
    if (allBookings.length > 0) {
        allBookings.forEach(function (booking, index) {
            let price = parseInt(booking.giaHangPhong.replace(/[^0-9]/g, ""));
            let formattedPrice = price.toLocaleString('vi-VN') + " VND";

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
                    </div>
                    <hr>
                </div>
            `;
            document.getElementById('TTbookingList').innerHTML += bookingHTML;
        });
    } else {
        document.getElementById('TTbookingList').innerHTML = "<p>Không có thông tin đặt phòng.</p>";
    }
});

function CheckDataFormThanhToan() {
    const fullName = document.getElementById('fullNameThanhToan').value.trim();
    const phoneNumber = document.getElementById('PhoneNumberThanhToan').value.trim();
    const phoneNumber2 = document.getElementById('PhoneNumberThanhToan2').value.trim();
    const cccd = document.getElementById('cccdThanhToan').value.trim();
    const email = document.getElementById('EmailAddressThanhToan').value.trim();
    const checkbox = document.getElementById('checkDieuKhoanThanhToan');

    // Reset thông báo lỗi
    document.getElementById('fullNameErrorTT').textContent = '';
    document.getElementById('phoneNumberErrorTT').textContent = '';
    document.getElementById('phoneNumber2ErrorTT').textContent = '';
    document.getElementById('cccdErrorTT').textContent = '';
    document.getElementById('emailErrorTT').textContent = '';
    document.getElementById('checkboxErrorTT').textContent = '';

    // Biến cờ để theo dõi xem có lỗi nào không
    let isValid = true;

    // Kiểm tra họ tên
    if (fullName === "") {
        document.getElementById('fullNameErrorTT').textContent = "Vui lòng nhập họ tên của bạn.";
        isValid = false;
    }

    // Kiểm tra số CCCD (12 chữ số)
    const cccdRegex = /^[0-9]{12}$/;
    if (!cccdRegex.test(cccd)) {
        document.getElementById('cccdErrorTT').textContent = "Vui lòng nhập số CCCD gồm 12 chữ số.";
        isValid = false;
    }

    // Kiểm tra số điện thoại (10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('phoneNumberErrorTT').textContent = "Vui lòng nhập số điện thoại gồm 10 chữ số.";
        isValid = false;
    } else if (phoneNumber2 !== phoneNumber) {
        document.getElementById('phoneNumber2ErrorTT').textContent = "Số điện thoại nhập lại không đúng.";
        isValid = false;
    }
    if (!phoneRegex.test(phoneNumber2)) {
        document.getElementById('phoneNumber2ErrorTT').textContent = "Vui lòng nhập số điện thoại gồm 10 chữ số.";
        isValid = false;
    }

    // Kiểm tra địa chỉ email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailErrorTT').textContent = "Vui lòng nhập địa chỉ email đúng định dạng.";
        isValid = false;
    }

    // Kiểm tra nếu checkbox đã được chọn
    if (!checkbox.checked) {
        document.getElementById('checkboxErrorTT').textContent = "Bạn cần đồng ý với điều khoản đặt phòng trước khi tiếp tục.";
        isValid = false;
    }

    if (!isValid) {
        return false;
    }
    // Nếu tất cả các thông tin đều hợp lệ
    return true;

}

$(document).ready(function () {
    $('#btnThanhToan').click(function () {

        if (!CheckDataFormThanhToan()) {
            // Nếu dữ liệu không hợp lệ, dừng lại
            return;
        }
        // Lấy dữ liệu từ form
        const fullName = $('#fullNameThanhToan').val().trim();
        const sex = $('#sexThanhToan').val();
        const cccd = $('#cccdThanhToan').val().trim();
        const phoneNumber = $('#PhoneNumberThanhToan').val().trim();
        const phoneNumber2 = $('#PhoneNumberThanhToan2').val().trim();
        const email = $('#EmailAddressThanhToan').val().trim();
        const additionalRequest = $('#b_content').val().trim();

        // Kiểm tra dữ liệu hợp lệ
        if (phoneNumber !== phoneNumber2) {
            alert('Số điện thoại nhập lại không khớp!');
            return;
        }

        // Lấy dữ liệu từ SessionStorage
        const sessionData = JSON.parse(sessionStorage.getItem('allBookings')) || [];
        if (sessionData.length === 0) {
            alert('Không có dữ liệu đặt phòng trong SessionStorage.');
            return;
        }

        // Lấy giá trị từ phần tử #TTTongCong và loại bỏ " VND"
        const TongThanhToan = $('#ThanhToanTongCong').text().trim().replace(' VND', '').replace(/\./g, '');

        // Tạo danh sách các đặt phòng
        const bookings = sessionData.map(booking => ({
            FullName: fullName,
            Sex: sex,
            CCCD: cccd,
            PhoneNumber: phoneNumber,
            EmailAddress: email,
            AdditionalRequest: additionalRequest,
            MaHangPhong: booking.maHangPhong,  // Lấy thông tin từ session
            TenHangPhong: booking.tenHangPhong,
            NgayNhan: booking.ngayNhan,
            NgayTra: booking.ngayTra,
            SoLuongPhong: parseInt(booking.soLuong),
            TongThanhToan: parseFloat(TongThanhToan) // Chuyển giá trị thành số
        }));

        console.log(bookings);

        // Gửi AJAX request
        $.ajax({
            url: '/KhachHang/ThanhToan/DatPhongOnline', // Thay bằng đường dẫn controller/action
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bookings), // Gửi danh sách đặt phòng
            success: function (response) {
                if (response.success) {
                    alert('Đặt phòng thành công!');
                    sessionStorage.removeItem('allBookings'); // Xóa SessionStorage
                    window.location.href = response.redirectUrl; // Điều hướng đến URL trả về từ server
                } else {
                    alert('Có lỗi xảy ra: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Lỗi AJAX:', status, error);
                alert('Không thể thực hiện đặt phòng. Vui lòng thử lại.');
            }
        });
    });
});
function calculateTotalFromSessionStorage() {
    // Lấy dữ liệu từ sessionStorage
    const data = sessionStorage.getItem("allBookings");

    if (!data) {
        document.getElementById('ThanhToanTongCong').textContent = "0 VND";
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
    document.getElementById('ThanhToanTongCong').textContent = formattedWithVND;
}

// Gọi hàm để tính và hiển thị tổng
calculateTotalFromSessionStorage();
