$(document).ready(function () {
    LoadThongTinPhong();
    //tìm kiếm
    $('#timKiemThongTinPhongLT').on('input', function () {
        var query = $(this).val().toLowerCase(); // Lấy giá trị tìm kiếm và chuyển thành chữ thường
        $('#tblBodyThongTinPhongLT tr').each(function () {
            var rowText = $(this).text().toLowerCase(); // Lấy toàn bộ văn bản của một dòng
            if (rowText.includes(query)) {  // Nếu dòng chứa chuỗi tìm kiếm
                $(this).show();  // Hiển thị dòng
            } else {
                $(this).hide();  // Ẩn dòng
            }
        });
    });

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
                        <td>${item.giaPhong.toLocaleString() } VND</td>
                        <td></td>`;

                    // Xử lý trạng thái phòng
                    if (item.trangThai === "Trống" || item.trangThai === "Đã thanh toán") {
                        object += `
                        <td class="text-secondary">Trống</td>
                        <td>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="layThongTinPhong('${item.maPhong}'), HienThi()" data-bs-toggle="modal" data-bs-target="#roomModal">
                                Chọn phòng
                            </button>
                        </td>`;
                    } else if (item.trangThai === "Đã đặt") {
                        object += `
                        <td class="text-warning">${item.trangThai}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm text-light" onclick="ThongTinNhanPhong('${item.maDatPhong}')">
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
                            <button type="button" class="btn btn-secondary btn-sm" onclick="layThongTinPhong('${item.maPhong}'), HienThi()"  data-bs-toggle="modal" data-bs-target="#roomModal">
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
                                        <input type="text" class="form-control" id="TenDatDat" value="${item.khachHang.hoTen}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Số điện thoại:</span></h6>
                                        <input type="text" class="form-control" id="SdtDatDat" value="${item.khachHang.soDienThoai}" disabled>
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
                                        <input type="text" class="form-control" id="CccdDatDat" value="${item.khachHang.cccd}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày nhận:</span></h6>
                                        <input type="text" class="form-control datepicker" id="NgayNhanDaDat" value="${item.ngayNhan}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Ngày trả:</span></h6>
                                        <input type="text" class="form-control datepicker" id="NgayTraDaDat" value="${item.ngayTra}" disabled>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Email:</span></h6>
                                        <input type="email" class="form-control" id="EmailDatDat" value="${item.khachHang.email}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Hạng phòng:</span></h6>
                                        <input type="text" class="form-control" id="HPDaDat" value="${item.hangPhong.tenHangPhong}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tên phòng:</span></h6>
                                        <input type="text" class="form-control" id="TPDatDat" value="${item.phong.maPhong}" disabled>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Tổng số ngày:</span></h6>
                                        <input type="text" class="form-control" value="${item.tongSoNgay}" disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Yêu cầu:</span></h6>
                                        <input type="text" class="form-control" id="YeuCauDaDat" value="${item.yeuCau} " disabled>
                                    </div>
                                    <div class="col-4">
                                        <h6><span style="font-weight: 600;">Thanh toán:</span></h6>
                                        <input type="text" class="form-control" id="TtDaDat" value="${item.tongThanhToan.toLocaleString()} VND" disabled>
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

//Lay thong tin phong
function layThongTinPhong(maPhong) {
    $.ajax({
        url: `/LeTan/QuanLyDatPhong/GetMaPhong/${maPhong}`,
        type: "GET",
        success: function (response) {
            if (response.success) {
                const giaPhong = response.data.giaHangPhong;
                const maHangPhong = response.data.maHangPhong;
                // Sử dụng .val() để gán giá trị cho input
                $("#MaHangPhongTrongLT").val(maHangPhong);
                $("#MaPhongTrongLT").val(maPhong);
                $("#giaHangPhongLT").val(giaPhong.toLocaleString());
            } else {
                alert(response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Lỗi:", error);
            alert("Lỗi khi lấy thông tin phòng.");
        }
    });
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
    document.getElementById("YeuCauTrong").value = "";
    document.getElementById("TtTrong").value = 0 + " VND";
    document.getElementById("NgayTrong").value = 0;
    document.querySelectorAll(".error").forEach(el => el.textContent = ""); // Reset lỗi
}

//Xử lý nút Đặt phòng 
function xuLyDatPhong() {
    // Lấy dữ liệu từ các input
    const name = document.getElementById("TenTrong").value.trim();
    const phone = document.getElementById("SdtTrong").value.trim();
    const gender = document.getElementById("GioiTingTrong").value;
    const cccd = document.getElementById("CccdTRong").value.trim();
    const checkInDate = document.getElementById("NgayNhanTrong").value;
    const checkOutDate = document.getElementById("NgayTraTrong").value;
    const email = document.getElementById("EmailTrong").value.trim();
    const yeuCau = document.getElementById("YeuCauTrong").value.trim();
    const TongThanhToan = document.getElementById("TtTrong").value.trim();
    const maPhong = document.getElementById("MaPhongTrongLT").value.trim();
    const maHangPhong = document.getElementById("MaHangPhongTrongLT").value.trim();

    // Kiểm tra input cơ bản
    if (!name || !phone || !checkInDate || !checkOutDate || !TongThanhToan) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Tạo đối tượng JSON gửi lên server
    const bookings = {
        FullName: name,
        Sex: gender,
        CCCD: cccd,
        PhoneNumber: phone,
        EmailAddress: email,
        AdditionalRequest: yeuCau,
        MaPhong: maPhong,
        MaHangPhong: maHangPhong,
        NgayNhan: checkInDate,
        NgayTra: checkOutDate,
        TongThanhToan: parseFloat(TongThanhToan)
    };

    // Gửi AJAX request
    $.ajax({
        url: '/LeTan/QuanLyDatPhong/DatPhongTrong', // Thay bằng đường dẫn controller/action
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bookings),
        success: function (response) {
            if (response.success) {
                alert(response.message);
                resetForm(); // Hàm reset các ô input
                $('#roomModal').modal('hide'); // Ẩn modal (nếu dùng bootstrap)
                LoadThongTinPhong(); // Tải lại danh sách phòng
            } else {
                alert('Có lỗi xảy ra: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi AJAX:', status, error);
            alert('Không thể thực hiện đặt phòng. Vui lòng thử lại.');
        }
    });
}

//Xử lý nút Nhận phòng 
function xuLyNhanPhong() {
    // Lấy dữ liệu từ các input
    const name = document.getElementById("TenTrong").value.trim();
    const phone = document.getElementById("SdtTrong").value.trim();
    const gender = document.getElementById("GioiTingTrong").value;
    const cccd = document.getElementById("CccdTRong").value.trim();
    const checkInDate = document.getElementById("NgayNhanTrong").value;
    const checkOutDate = document.getElementById("NgayTraTrong").value;
    const email = document.getElementById("EmailTrong").value.trim();
    const yeuCau = document.getElementById("YeuCauTrong").value.trim();
    const TongThanhToan = document.getElementById("TtTrong").value.trim();
    const maPhong = document.getElementById("MaPhongTrongLT").value.trim();
    const maHangPhong = document.getElementById("MaHangPhongTrongLT").value.trim();

    // Kiểm tra input cơ bản
    if (!name || !phone || !checkInDate || !checkOutDate || !TongThanhToan) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    // Tạo đối tượng JSON gửi lên server
    const bookings = {
        FullName: name,
        Sex: gender,
        CCCD: cccd,
        PhoneNumber: phone,
        EmailAddress: email,
        AdditionalRequest: yeuCau,
        MaPhong: maPhong,
        MaHangPhong: maHangPhong,
        NgayNhan: checkInDate,
        NgayTra: checkOutDate,
        TongThanhToan: parseFloat(TongThanhToan)
    };

    // Gửi AJAX request
    $.ajax({
        url: '/LeTan/QuanLyDatPhong/NhanPhongTrong', // Thay bằng đường dẫn controller/action
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bookings),
        success: function (response) {
            if (response.success) {
                alert(response.message);
                resetForm(); // Hàm reset các ô input
                $('#roomModal').modal('hide'); // Ẩn modal (nếu dùng bootstrap)
                LoadThongTinPhong(); // Tải lại danh sách phòng
            } else {
                alert('Có lỗi xảy ra: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Lỗi AJAX:', status, error);
            alert('Không thể thực hiện đặt phòng. Vui lòng thử lại.');
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

    return isValid;
}


//Thực hiện hành động đặt phòng
function NutNhanPhongTrong() {
    if (validateForm()) {
        if (!confirm("Bạn có chắc chắn muốn nhận phòng này?")) {
            return;
        }
        xuLyNhanPhong();
    } else {
        console.log('Có lỗi trong dữ liệu nhập vào.');
    }
}

//Thực hiện hành động đặt phòng
function NutDatPhongTrong() {
    if (validateForm()) {
        if (!confirm("Bạn có chắc chắn muốn đặt phòng này?")) {
            return;
        }
        xuLyDatPhong();
    } else {
        console.log('Có lỗi trong dữ liệu nhập vào.');
    }
}
function HienThi() {
    $('#NgayNhanTrong, #NgayTraTrong').on('change', function () {
        // Lấy giá trị Ngày nhận và Ngày trả
        var ngayNhan = $('#NgayNhanTrong').val();
        var ngayTra = $('#NgayTraTrong').val();
        var giaHangPhong = $('#giaHangPhongLT').val();
        var giaHangPhongSo = parseFloat(giaHangPhong.replace(/[.,]/g, ''));

        // Kiểm tra nếu cả hai trường đều có giá trị
        if (ngayNhan && ngayTra) {
            // Tách chuỗi ngày tháng thành các phần (dd/MM/yyyy)
            var ngayNhanParts = ngayNhan.split('/');
            var ngayTraParts = ngayTra.split('/');

            // Tạo đối tượng Date từ chuỗi ngày tháng (chú ý tháng bắt đầu từ 0)
            var dateNhan = new Date(ngayNhanParts[2], ngayNhanParts[1] - 1, ngayNhanParts[0]);
            var dateTra = new Date(ngayTraParts[2], ngayTraParts[1] - 1, ngayTraParts[0]);

            // Tính số ngày (Ngày trả - Ngày nhận)
            var tongSoNgay = (dateTra - dateNhan) / (1000 * 60 * 60 * 24); // Kết quả tính theo ngày
            var tongThanhToan = tongSoNgay * giaHangPhongSo;
            // Kiểm tra tổng số ngày hợp lệ
            if (tongSoNgay > 0) {
                // Cập nhật giá trị vào trường Tổng số ngày
                $('#NgayTrong').val(tongSoNgay);
                $('#TtTrong').val(tongThanhToan.toLocaleString() + " VND");
            }
        } else {
            // Nếu thiếu một trong hai ngày, đặt giá trị về 0
            $('#NgayTrong').val(0);
        }
    });
}









