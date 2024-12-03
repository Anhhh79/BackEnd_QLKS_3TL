//Kiem tra so dien thoai trong chuc nang tra cuu
function validatePhoneNumber() {
    // Kiểm tra nếu số điện thoại chưa được nhập
    const phoneNumber = document.getElementById("SoDienThoaiTraCuu").value.trim();
    if (!phoneNumber) {
        alert("Bạn chưa nhập số điện thoại!");
        return false;
    }

    // Biểu thức chính quy để kiểm tra định dạng số điện thoại
    const phoneRegex = /^0\d{9,10}$/;
    //Kiểm tra nếu số điện thoại không hợp lệ
    if (!phoneRegex.test(phoneNumber)) {
        alert("Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại bắt đầu bằng 0 và có 10-11 chữ số.");
        clearPhoneNumber();
        return false;
    }
    else {
        const myModal = new bootstrap.Modal(document.getElementById('OTPTraCuu'));
        myModal.show();
    }
    return true;
}

// <!-- xoa sdt sao khi tra cuu -->
function clearPhoneNumber() {
    const NumberInput = document.getElementById('SoDienThoaiTraCuu');
    NumberInput.value = '';
}
//Kiem tra nhap otp trong chuc nang tra cuu
function checkOTPTraCuu() {
    const otpInputs = document.querySelectorAll('.otp-input');
    let biendem = 0;
    const otpError = document.getElementById('otpError'); // Phần tử thông báo lỗi cho OTP
    var check = true;
    const phoneNumber = document.getElementById("SoDienThoaiTraCuu").value.trim();
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
        check = false;
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
    if (check) {
        LoadThongTinDatPhong(phoneNumber);
        clearPhoneNumber();
    }
    return true;
}
//Tra cuu
function LoadThongTinDatPhong(soDienThoai) {
    const baseUrl = '/KhachHang/TraCuu/TraCuuLichSu/';

    $.ajax({
        url: baseUrl + soDienThoai,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            const tableBody = $('#tblBodyLichSuDatPhong');
            tableBody.empty(); // Xóa dữ liệu cũ
            if (!response.success || !response.data || response.data.length === 0) {
                const noDataMessage = '<div class="text-center"><strong>Không tìm thấy thông tin đặt phòng</strong></div>';
                tableBody.html(noDataMessage);
                return;
            }

            // Render dữ liệu
            response.data.forEach((item, index) => {
                const row = `
                    <div class="pt-2">
                        <div class="container mt-2 shadow div-hover"
                             style="background:white;border-radius: 20px; font-weight: 600 ">
                            <div class="row">
                                <div class="col-2 thongTinLichSuDatPhong" style="padding: 15px 10px 15px 15px;">
                                    <span>
                                        ${item.thoiGianDat.split('T').join(' / ')}
                                    </span>
                                </div>
                                <div class="col-2 thongTinLichSuDatPhong" style="padding: 15px 10px 15px 0;">
                                    <span>${item.hoTen}</span>
                                </div>
                                <div class="col-1 thongTinLichSuDatPhong" style="padding: 15px 0 15px 0;">
                                    <span>${item.soDienThoai}</span>
                                </div>
                                <div class="col-2 thongTinLichSuDatPhong" style="padding: 15px 10px 15px 10px;">
                                    <span>${item.maPhong}</span> /
                                    <span>
                                        ${item.tenHangPhong}
                                    </span>
                                </div>
                                <div class="col-2 thongTinLichSuDatPhong" style="padding: 15px 10px 15px 0;">
                                    <span>${item.ngayNhan}</span> /
                                    <span>${item.ngayTra}</span>
                                </div>
                                <div class="col-2 thongTinLichSuDatPhong" style="padding: 15px 0 15px 0;">
                                    <span><b>${item.tongThanhToan.toLocaleString()}</b></span>
                                    <b>VND</b>
                                </div>
                                <!-- <div class="col-1 thongTinLichSuDatPhong" style="padding: 15px 0 15px 15px;">
                                        <button class="btn btn-danger btn-sm">Hủy</button>
                                     </div> -->

                            </div>
                        </div>
                    </div>`;
                tableBody.append(row);
            });
        },
        error: function () {
            alert('Không thể lấy thông tin đặt phòng.');
        }
    });
}
