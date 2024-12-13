// <!-- tra cuu dat phong -->
// <!-- input OTP -->
const otpInputs = document.querySelectorAll('.otp-field input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', (event) => {
        const value = event.target.value;
        if (value.length === 1) {
            if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        }
    });
});
// <!-- // Xóa giá trị của mỗi ô nhập -->
function clearOtpInputs() {
    const otpInputs = document.querySelectorAll('.otp-field input');
    otpInputs.forEach((input) => {
        input.value = '';
    });
}


//trang thanh toán 
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

    alert("Tất cả thông tin đều hợp lệ.");
    return true;

}

////ngan dong modal
//$(document).ready(function () {
//    // Khi modal mở ra
//    $('#LichSuDatPhong').on('show.bs.modal', function (e) {
//        // Ngăn modal đóng khi nhấn vào bên ngoài
//        $(this).attr('data-bs-backdrop', 'static');
//        $(this).attr('data-bs-keyboard', 'false');
//    });
//    // Ngăn modal đóng khi nhấn vào modal
//    $('#LichSuDatPhong').on('click', function (e) {
//        if ($(e.target).is(this)) {
//            e.preventDefault(); // Ngăn chặn hành động mặc định
//        }
//    });
//});



