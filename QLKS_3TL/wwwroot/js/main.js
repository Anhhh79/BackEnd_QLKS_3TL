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
// <!-- xoa sdt sao khi tra cuu -->
function clearPhoneNumber() {
    const NumberInput = document.getElementById('SoDienThoaiTraCuu');
    NumberInput.value = '';
}

// <!-- danh gia -->
// <!-- xoa du lieu -->
function clearDataAssessInput() {
    const inputFields = document.getElementsByClassName('Assess');
    Array.from(inputFields).forEach((input) => {
        input.value = '';
    });
}
// <!-- xoa so sao -->
function clearStarAssess() {
    const radioOptions = document.getElementsByClassName('star');
    Array.from(radioOptions).forEach((radio) => {
        radio.checked = false;
    });
}
//Kiem tra so dien thoai trong chuc nang tra cuu
function validatePhoneNumber() {
    // Lấy giá trị từ ô nhập liệu
    const phoneNumber = document.getElementById("SoDienThoaiTraCuu").value;

    // Kiểm tra nếu số điện thoại chưa được nhập
    if (!phoneNumber) {
        alert("Bạn chưa nhập số điện thoại!");
        return false;
    }

    // Biểu thức chính quy để kiểm tra định dạng số điện thoại
    const phoneRegex = /^0\d{9,10}$/;

    // Kiểm tra nếu số điện thoại không hợp lệ
    if (!phoneRegex.test(phoneNumber)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại bắt đầu bằng 0 và có 10-11 chữ số.");
        return false;
    }
    else {
        const myModal = new bootstrap.Modal(document.getElementById('OTPTraCuu'));
        myModal.show();
    }
    return true;
}
//Kiem tra nhap otp trong chuc nang tra cuu
function checkOTPTraCuu() {
    const otpInputs = document.querySelectorAll('.otp-input');
    let biendem = 0;
    const otpError = document.getElementById('otpError'); // Phần tử thông báo lỗi cho OTP

    // Reset thông báo lỗi trước khi kiểm tra
    otpError.textContent = '';

    otpInputs.forEach(input => {
        if (input.value.trim()) { // Kiểm tra nếu ô nhập không trống
            biendem++;
        }
    });

    if (biendem != 6) {
        otpError.textContent = "Bạn cần nhập đầy đủ OTP gồm 6 số"; // Hiển thị thông báo lỗi
        otpInputs[0].focus(); // Đặt focus vào ô nhập đầu tiên
        return false;
    } else {
        // Đóng modal hiện tại 
        const currentModal = bootstrap.Modal.getInstance(document.getElementById('OTPTraCuu'));
        if (currentModal) {
            currentModal.hide(); // Ẩn modal hiện tại
        }

        // Hiển thị modal Lich Su
        const ModalLichSu = new bootstrap.Modal(document.getElementById('LichSuDatPhong'));
        ModalLichSu.show();
    }

    return true;
}


//ham xoa so dien thoại danh gia
function clearPhoneNumberDanhGia() {
    const NumberInput = document.getElementById('PhoneNumberAssess');
    NumberInput.value = '';
}
//Kiem tra nhap thong tin trong chuc nang danh gia

function validateAssessmentForm() {
    // Lấy giá trị của họ tên
    const fullName = document.getElementById('fullNameAssess').value.trim();
    const fullNameError = document.getElementById('fullNameError'); // Phần tử thông báo lỗi cho họ tên

    // Lấy giá trị của số điện thoại
    const phoneNumber = document.getElementById('PhoneNumberAssess').value.trim();
    const phoneNumberError = document.getElementById('phoneNumberError'); // Phần tử thông báo lỗi cho số điện thoại

    // Kiểm tra xem có radio nào được chọn cho phần đánh giá sao hay không
    const starRating = document.querySelector('input[name="rating"]:checked');
    const starRatingError = document.getElementById('starRatingError'); // Phần tử thông báo lỗi cho đánh giá sao

    // Biểu thức chính quy để kiểm tra số điện thoại (10 chữ số)
    const phoneRegex = /^[0-9]{10}$/;

    // Reset các thông báo lỗi trước khi kiểm tra
    fullNameError.textContent = '';
    phoneNumberError.textContent = '';
    starRatingError.textContent = '';

    // Biến cờ để theo dõi trạng thái hợp lệ của form
    let isValid = true;

    // Kiểm tra xem họ tên đã được nhập chưa
    if (fullName === "") {
        fullNameError.textContent = "Vui lòng nhập họ tên của bạn.";
        isValid = false;
    }

    // Kiểm tra xem số điện thoại đã được nhập và hợp lệ chưa
    if (phoneNumber === "" || !phoneRegex.test(phoneNumber)) {
        phoneNumberError.textContent = "Vui lòng nhập số điện thoại hợp lệ (10 chữ số).";
        isValid = false;
    }

    // Kiểm tra xem người dùng có chọn số sao hay chưa
    if (!starRating) {
        starRatingError.textContent = "Vui lòng chọn số sao để đánh giá khách sạn.";
        isValid = false;
    }

    // Nếu có lỗi, không tiếp tục thực hiện
    if (!isValid) {
        return false;
    }

    // Ẩn modal hiện tại nếu không có lỗi
    const currentModal1 = bootstrap.Modal.getInstance(document.getElementById('modalDanhGia'));
    if (currentModal1) {
        currentModal1.hide(); // Ẩn modal hiện tại
    }

    // Nếu tất cả các trường hợp đều hợp lệ
    alert("Đã gửi đánh giá của bạn!");
    clearDataAssessInput();
    clearStarAssess();
    return true;
}


// Thêm sự kiện focus để ẩn thông báo lỗi khi nhấp vào ô nhập
document.getElementById('fullNameAssess').addEventListener('focus', function () {
    document.getElementById('fullNameError').textContent = '';
});

document.getElementById('PhoneNumberAssess').addEventListener('focus', function () {
    document.getElementById('phoneNumberError').textContent = '';
});

const starInputs = document.querySelectorAll('input[name="rating"]');
starInputs.forEach(function (input) {
    input.addEventListener('change', function () {
        document.getElementById('starRatingError').textContent = '';
    });
});



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



