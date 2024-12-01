$(document).ready(function () {
    LoadThongTinPhong()
});
//load thông tin
function LoadThongTinPhong() {
    const baseUrl = '/LeTan/QuanLyDatPhong/LoadThongTinPhongLT';
    $.ajax({
        url: baseUrl,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (!response.success || !response.data || response.data.length === 0) {
                let object = '<tr><td colspan="8" class="text-center">Không có phòng nào để hiển thị</td></tr>';
                $('#tblBodyThongTinPhongLT').html(object);
            } else {
                let soThuTu = 1;
                let object = '';
                $.each(response.data, function (index, item) {
                    object += `
                    <tr>
                        <th scope="row">${soThuTu}</th>
                        <td class="me-2">${item.maPhong}</td>
                        <td>${item.tenHangPhong}</td>
                        <td></td>
                        <td>${item.giaPhong} / h</td>
                        <td></td>`;

                    // Xử lý trạng thái phòng
                    if (item.trangThai === "Trống" || item.trangThai === "Đã thanh toán") {
                        object += `
                        <td class="text-secondary">Trống</td>
                        <td>
                            <button type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#roomModal">
                                Chọn phòng
                            </button>
                        </td>`;
                    } else if (item.trangThai === "Đã đặt") {
                        object += `
                        <td class="text-warning">${item.trangThai}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm" onclick="ThongTinNhanPhong('${item.maDatPhong}')">
                                Nhận phòng
                            </button>
                        </td>`;
                    } else if (item.trangThai === "Đang hoạt động") {
                        object += `
                        <td class="text-success">${item.trangThai}</td>
                        <td>
                            <button type="button" class="btn btn-success btn-sm" style="padding-left: 16px; padding-right: 16px;" onclick="ThongTinTraPhong('${item.maDatPhong}')">
                                Trả phòng
                            </button>
                        </td>`;
                    }
                    else {
                        object += `
                        <td class="text-secondary">Trống</td>
                        <td>
                            <button type="button" class="btn btn-secondary btn-sm"  data-bs-toggle="modal" data-bs-target="#roomModal">
                                Chọn phòng
                            </button>
                        </td>`;
                    }
                    object += `</tr>`;
                    soThuTu++;
                });
                $('#tblBodyThongTinPhongLT').html(object);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin phòng:', textStatus, errorThrown);
            alert('Không thể lấy thông tin phòng. Vui lòng kiểm tra lại.');
        }
    });
}

//Hien thi thong tin len modal nhan
function ThongTinNhanPhong(maDatPhong2) {
    if (!maDatPhong2) {
        alert('Mã đặt phòng không hợp lệ.');
        return;
    }

    const baseUrl = '/LeTan/QuanLyDatPhong/GetThongTinNhanPhong/';
    $.ajax({
        url: baseUrl + maDatPhong2, // Thêm dấu "/" để nối URL chính xác
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const item = response.data;
                let object = `
                    <div class="modal-header d-flex justify-content-center">
                <div>
                    <h5 style="font-weight: bolder;">Thông tin phòng</h5>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        <div class="col-12 px-0">
                            <div class="container" id="modalNhanPhongLT">
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Họ tên:</span></h6>
                                        <input type="text" class="form-control" id="TenDatDat" value="${item.khachHang.hoTen}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Số điện thoại:</span></h6>
                                        <input type="text" class="form-control" id="SdtDatDat" value="${item.khachHang.soDienThoai}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Giới tính:</span></h6>
                                        <select class="form-select" id="gioiTinhDatDat" disabled>
                                            <option value="Nam" ${item.khachHang.gioiTinh === 'Nam' ? 'selected' : ''}>Nam</option>
                                            <option value="Nữ" ${item.khachHang.gioiTinh === 'Nữ' ? 'selected' : ''}>Nữ</option>
                                            <option value="Khác" ${item.khachHang.gioiTinh === 'Khác' ? 'selected' : ''}>Khác</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">CCCD:</span></h6>
                                        <input type="text" class="form-control" id="CccdDatDat" value="${item.khachHang.cccd}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày nhận:</span></h6>
                                        <input type="text" class="form-control datepicker" id="NgayNhanDaDat" value="${item.ngayNhan}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày trả:</span></h6>
                                        <input type="text" class="form-control datepicker" id="NgayTraDaDat" value="${item.ngayTra}" readonly>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Email:</span></h6>
                                        <input type="email" class="form-control" id="EmailDatDat" value="${item.khachHang.email}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Hạng phòng:</span></h6>
                                        <input type="text" class="form-control" id="HPDaDat" value="${item.hangPhong.tenHangPhong}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tên phòng:</span></h6>
                                        <input type="text" class="form-control" id="TPDatDat" value="${item.phong.maPhong}" readonly>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tổng số ngày:</span></h6>
                                        <input type="text" class="form-control" value="${item.tongSoNgay}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Yêu cầu:</span></h6>
                                        <input type="text" class="form-control" id="YeuCauDaDat" value="${item.yeuCauThem || 'Không'}" readonly>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Thanh toán:</span></h6>
                                        <input type="text" class="form-control" id="TtDaDat" value="${item.tongThanhToan.toLocaleString()} VND" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" id="NhanPhong" onclick="XuLyNhanPhong('${maDatPhong2}')">Nhận phòng</button>
            </div>
                `;
                $('#modalNhanPhongLT').html(object);
                $('#yellowRoomModal').modal('show'); // Hiển thị modal
            } else {
                alert(response.message || 'Đã xảy ra lỗi khi lấy thông tin phòng.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin phòng:', textStatus, errorThrown);
            alert('Không thể lấy thông tin phòng. Vui lòng kiểm tra lại.');
        }
    });
}

//Hiển thị thông tin lên modal trả
function ThongTinTraPhong(maDatPhong) {
    if (!maDatPhong) {
        alert('Mã đặt phòng không hợp lệ.');
        return;
    }

    const baseUrl = '/LeTan/QuanLyDatPhong/GetThongTinTraPhong/';
    $.ajax({
        url: baseUrl + maDatPhong, // Thêm dấu "/" để nối URL chính xác
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const item = response.data;
                let object = `
                    <div class="modal-header d-flex justify-content-center">
                <div>
                    <h5 style="font-weight: bolder;">Trả phòng</h5>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        <div class="col-12 px-0">
                            <div class="container" >
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Họ tên:</span></h6>
                                        <input type="text" class="form-control" value="${item.khachHang.hoTen}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Số điện thoại:</span></h6>
                                        <input type="text" class="form-control" value=" ${item.khachHang.soDienThoai}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Giới tính:</span></h6>
                                        <input type="text" class="form-control" value=" ${item.khachHang.gioiTinh}" disabled>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">CCCD:</span></h6>
                                        <input type="text" class="form-control" value=" ${item.khachHang.cccd}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày nhận:</span></h6>
                                        <input type="text" class="form-control" id="checkInDate" value=" ${item.ngayNhan}"
                                               disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày trả:</span></h6>
                                        <input type="text" class="form-control" id="checkOutDate" value=" ${item.ngayTra}"
                                               disabled>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Email:</span></h6>
                                        <input type="email" class="form-control" value=" ${item.khachHang.email}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tổng số ngày:</span></h6>
                                        <input type="text" class="form-control" value="${item.tongSoNgay}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Hạng phòng:</span></h6>
                                        <input type="text" class="form-control" value=" ${item.hangPhong.tenHangPhong}" disabled>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tên phòng:</span></h6>
                                        <input type="text" class="form-control" value=" ${item.phong.maPhong}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Yêu cầu:</span></h6>
                                        <input type="text" class="form-control" id="YeuCauDaDat" value="${item.yeuCau || 'Không'}" disabled>

                                    </div>

                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Thanh Toán:</span></h6>
                                        <input type="text" class="form-control" value="${item.tongThanhToan.toLocaleString()} VND" disabled>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" onclick="XuLyTraPhong('${maDatPhong}')">Trả phòng và Thanh Toán</button>
            </div>
                `;
                $('#bodyModalTraPhong').html(object);
                $('#checkoutModal').modal('show'); // Hiển thị modal
            } else {
                alert(response.message || 'Đã xảy ra lỗi khi lấy thông tin phòng.');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Lỗi khi lấy thông tin phòng:', textStatus, errorThrown);
            alert('Không thể lấy thông tin phòng. Vui lòng kiểm tra lại.');
        }
    });
}

//Xử lý nút trả phòng
function XuLyTraPhong(maDatPhong) {
    if (!confirm("Bạn có chắc chắn muốn trả phòng này?")) {
        return;
    }

    const url = `/LeTan/QuanLyDatPhong/XuLyTraPhong?maDatPhong=${maDatPhong}`;

    $.ajax({
        url: url, // Gửi mã đặt phòng qua URL
        type: 'POST', // Sử dụng phương thức POST
        dataType: 'json', // Định dạng dữ liệu trả về là JSON
        success: function (response) {
            if (response.success) {
                LoadThongTinPhong(); // Tải lại thông tin phòng nếu trả phòng thành công
                alert(response.message); // Hiển thị thông báo thành công
                $('#checkoutModal').modal('hide'); // Đóng modal sau khi xử lý
            } else {
                alert(response.message); // Hiển thị thông báo lỗi nếu có
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Lỗi khi xử lý trả phòng:", textStatus, errorThrown);
            alert("Không thể trả phòng. Vui lòng thử lại."); // Hiển thị thông báo lỗi
        }
    });
}

//Xử lý nút nhận phòng
function XuLyNhanPhong(maDatPhong) {
    if (!confirm("Bạn có chắc chắn muốn nhận phòng này?")) {
        return;
    }

    const url = `/LeTan/QuanLyDatPhong/XuLyNhanPhong?maDatPhong=${maDatPhong}`;

    $.ajax({
        url: url, // Gửi mã đặt phòng qua URL
        type: 'POST', // Sử dụng phương thức POST
        dataType: 'json', // Định dạng dữ liệu trả về là JSON
        success: function (response) {
            if (response.success) {
                LoadThongTinPhong(); // Tải lại thông tin phòng nếu trả phòng thành công
                alert(response.message); // Hiển thị thông báo thành công
                $('#yellowRoomModal').modal('hide'); // Đóng modal sau khi xử lý
            } else {
                alert(response.message); // Hiển thị thông báo lỗi nếu có
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Lỗi khi xử lý nhận phòng:", textStatus, errorThrown);
            alert("Không thể nhận phòng. Vui lòng thử lại."); // Hiển thị thông báo lỗi
        }
    });
}

//bắt lỗi đặt phòng 
function validateForm() {
    let isValid = true;

    // Lấy giá trị từ các input fields
    const name = document.getElementById("TenTrong").value.trim();
    const phone = document.getElementById("SdtTrong").value.trim();
    const gender = document.getElementById("GioiTingTrong").value;
    const cccd = document.getElementById("CccdTRong").value.trim();
    const checkInDate = document.getElementById("NgayNhanTrong").value;
    const checkOutDate = document.getElementById("NgayTraTrong").value;
    const email = document.getElementById("EmailTrong").value.trim();

    function setError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = "red";
        }
        isValid = false;
    }

    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    if (name === "") setError("NameError", "Vui lòng nhập họ tên");
    if (phone === "" || !/^\d{10,11}$/.test(phone)) setError("PhoneError", "Số điện thoại không hợp lệ (10-11 số)");
    if (gender === "") setError("GenderError", "Vui lòng chọn giới tính");
    if (cccd === "" || !/^\d{9,12}$/.test(cccd)) setError("CccdError", "Vui lòng nhập CCCD hợp lệ (9-12 số)");

    // Kiểm tra ngày nhận và ngày trả không được để trống
    if (checkInDate === "") {
        setError("CheckInDateError", "Vui lòng chọn ngày nhận");
       
    }
    if (checkOutDate === "") {
        setError("CheckOutDateError", "Vui lòng chọn ngày trả");
    }

    // Chuyển định dạng ngày sang chuẩn ISO (YYYY-MM-DD)
    const [ngayNhanFormatted, ngayTraFormatted] = [checkInDate, checkOutDate].map(dateStr => {
        const [day, month, year] = dateStr.split("/"); // Tách theo dấu "-"
        return `${year}-${month}-${day}`; // Chuyển thành YYYY-MM-DD
    });

    // Chuyển thành đối tượng Date để so sánh
    const checkNgayNhan = new Date(ngayNhanFormatted);
    const checkNgayTra = new Date(ngayTraFormatted);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Chỉ so sánh ngày, bỏ qua giờ

    // Kiểm tra ngày nhận không được trước ngày hiện tại
    if (checkNgayNhan < today) {
        setError("CheckInDateError", "Ngày nhận phải lớn hơn ngày hiện tại");
       
    }

    // Kiểm tra ngày trả phải sau ngày nhận ít nhất 1 ngày
    if (checkNgayTra <= checkNgayNhan) {
        setError("CheckOutDateError", "Ngày trả phải lớn hơn ngày nhận");
       
    }

    if (email === "" || !/^\S+@\S+\.\S+$/.test(email)) {
        setError("EmailError", "Vui lòng nhập email hợp lệ");
    }

    console.log("Ngay Nhan: " + checkNgayNhan);
    console.log("Ngay Tra: " + checkNgayTra);
    console.log("Ngay Hien Tai: " + today);

    return isValid;
}



    function resetForm() {
        // Đặt lại giá trị của các trường input
        document.getElementById("TenTrong").value = "";
    document.getElementById("SdtTrong").value = "";
    document.getElementById("GioiTingTrong").selectedIndex = 0; // Reset select
    document.getElementById("CccdTRong").value = "";
    document.getElementById("NgayNhanTrong").value = "";
    document.getElementById("NgayTraTrong").value = "";
    document.getElementById("EmailTrong").value = "";
    document.getElementById("HPTrong").selectedIndex = 0; // Reset select
    document.getElementById("TPTrong").selectedIndex = 0; // Reset select
    document.getElementById("YeuCauTrong").value = "";
    document.getElementById("TtTrong").value = "";
    document.getElementById("NgayTrong").value = "";
    document.querySelectorAll(".error").forEach(el => el.textContent = ""); // Reset lỗi
}

// document.getElementById("NhanPhongTrong").addEventListener("click", function () {
//     if (validateForm()) {
//         alert("Nhận phòng thành công!");
//         resetForm(); Đặt lại các trường input
//     }
// });

// document.getElementById("DatPhongTrong").addEventListener("click", function () {
//     if (validateForm()) {
//         alert("Đặt phòng thành công!");
//         resetForm(); Đặt lại các trường input
//     }
// });

    





