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
                $('#giaHP').text(data.giaHangPhong.toLocaleString() + ' '+ 'VND'); // Chú ý tên trường

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
    console.log(today)
    console.log(checkNgayNhan)
    console.log(checkNgayTra)

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


//document.addEventListener("DOMContentLoaded", function () {
//    // Lấy dữ liệu booking từ sessionStorage
//    let allBookings = JSON.parse(sessionStorage.getItem("allBookings")) || [];

//    // Kiểm tra nếu có dữ liệu
//    if (allBookings.length > 0) {
//        // Lặp qua tất cả bookings và tạo nội dung HTML tương ứng
//        allBookings.forEach(function (booking, index) {
//            // Chuyển giá từ chuỗi (ví dụ: "1,800,000 VND") thành số
//            let price = parseInt(booking.giaHangPhong.replace(/[^0-9]/g, "")); // Xóa tất cả ký tự không phải số

//            // Định dạng giá theo kiểu VND với dấu phân cách hàng nghìn
//            let formattedPrice = price.toLocaleString('vi-VN') + " VND";  // Định dạng với tiền tệ VND

//            // Tạo phần tử div cho mỗi booking
//            let bookingHTML = `
//                <div class="mt-3 mx-2 Datphong-hover" data-index="${index}">
//                    <div class="d-flex align-items-center">
//                        <h6 class="d-flex me-2 mb-0">Hạng phòng:</h6><span>${booking.tenHangPhong}</span>
//                    </div>
//                    <div class="d-flex mt-2">
//                        <div class="d-flex">
//                            <h6 class="mb-0 mt-1">Ngày nhận: </h6>
//                            <div class="ms-1">${booking.ngayNhan}</div>
//                        </div>
//                        <div class="d-flex" style="margin-left: 50px;">
//                            <h6 class="mb-0 mt-1">Ngày trả: </h6>
//                            <div class="ms-1">${booking.ngayTra}</div>
//                        </div>
//                    </div>
//                    <div class="d-flex align-items-center mt-1">
//                        <h6 class="d-flex me-2 mb-0">Số lượng:</h6><span>${booking.soLuong}</span>
//                    </div>
//                    <div class="d-flex align-items-center mt-1">
//                        <div class="col-6">
//                            <h6 class="me-2 mb-0" style="display: inline;">Giá:</h6>
//                            <span class="text-color textTitleRoom">${formattedPrice}</span>
//                        </div>
//                        <div class="d-flex mt-1 justify-content-end col-6">
//                            <button type="button" class="btn btn-danger btn-huy" style="font-size: smaller;">
//                                Hủy
//                            </button>
//                        </div>
//                    </div>
//                    <hr>
//                </div>
//            `;
//            // Thêm nội dung vào phần tử chứa thông tin booking
//            document.getElementById('bookingList').innerHTML += bookingHTML;
//        });
//    } else {
//        // Nếu không có dữ liệu, có thể hiển thị thông báo hoặc để trống
//        document.getElementById('bookingList').innerHTML = "<p>Không có thông tin đặt phòng.</p>";
//    }

//    // Thêm event listener cho tất cả các nút "Hủy"
//    document.querySelectorAll('.btn-huy').forEach(function (button) {
//        button.addEventListener('click', function () {
//            // Lấy chỉ mục của booking cần xóa từ thuộc tính data-index
//            let bookingIndex = this.closest('.Datphong-hover').getAttribute('data-index');
//            // Xóa booking tương ứng khỏi sessionStorage
//            allBookings.splice(bookingIndex, 1); // Loại bỏ booking theo chỉ mục

//            // Cập nhật lại sessionStorage
//            sessionStorage.setItem("allBookings", JSON.stringify(allBookings));

//            // Xóa phần tử HTML tương ứng
//            this.closest('.Datphong-hover').remove();

//            // Hiển thị thông báo
//            alert("Đã hủy chọn phòng!");
//        });
//    });
//});

document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu từ sessionStorage
    let allBookings = JSON.parse(sessionStorage.getItem("allBookings")) || [];

    // Hàm hiển thị booking từ sessionStorage lên giao diện
    function renderBookings() {
        const bookingList = document.getElementById('bookingList');
        bookingList.innerHTML = ""; // Xóa nội dung cũ
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
                            <div class="d-flex mt-1 justify-content-end col-6">
                                <button type="button" class="btn btn-danger btn-huy" style="font-size: smaller;">
                                    Hủy
                                </button>
                            </div>
                        </div>
                        <hr>
                    </div>
                `;
                bookingList.innerHTML += bookingHTML;
            });
        } else {
            bookingList.innerHTML = "<p>Không có thông tin đặt phòng.</p>";
        }

        // Gắn sự kiện cho các nút "Hủy"
        document.querySelectorAll('.btn-huy').forEach(function (button) {
            button.addEventListener('click', function () {
                let bookingIndex = this.closest('.Datphong-hover').getAttribute('data-index');
                allBookings.splice(bookingIndex, 1);
                sessionStorage.setItem("allBookings", JSON.stringify(allBookings));
                renderBookings(); // Cập nhật lại giao diện
                alert("Đã hủy chọn phòng!");
            });
        });
    }

    // Gọi hàm hiển thị khi tải trang
    renderBookings();
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

    //// Tính tổng số tiền
    //bookingData.forEach(item => {
    //    const price = parseFloat(item.giaHangPhong.replace(/[^\d]/g, '')); // Chỉ lấy phần số từ giá
    //    console.log(price);
    //    const quantity = parseInt(item.soLuong, 10); // Chuyển số lượng sang số nguyên

    //    if (!isNaN(price) && !isNaN(quantity)) {
    //        total += price * quantity;
    //    }
    //});

    bookingData.forEach(item => {
        // Chuyển giá từ chuỗi sang số
        const price = parseFloat(item.giaHangPhong.replace(/[^0-9]/g, '')); // Loại bỏ mọi ký tự không phải số
        const quantity = parseInt(item.soLuong, 10); // Chuyển số lượng sang số nguyên

        // Chuyển đổi định dạng ngày từ DD-MM-YYYY sang YYYY-MM-DD
        const formattedCheckInDate = item.ngayNhan.split('-').reverse().join('-');
        const formattedCheckOutDate = item.ngayTra.split('-').reverse().join('-');

        // Tạo đối tượng Date
        const checkInDate = new Date(formattedCheckInDate);
        const checkOutDate = new Date(formattedCheckOutDate);

        // Tính số ngày ở (đảm bảo ngày trả >= ngày nhận)
        const diffTime = checkOutDate - checkInDate;
        const days = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

        // Tính tổng nếu giá trị hợp lệ
        if (!isNaN(price) && !isNaN(quantity) && days > 0) {
            total += price * quantity * days;
        }
    });

    const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);

    // Thay đổi ký hiệu tiền tệ từ ₫ thành VND
    const formattedWithVND = formattedTotal.replace('₫', 'VND');

    console.log(formattedWithVND)

    // Hiển thị tổng số tiền vào phần tử có id "TTTongCong"
    document.getElementById('TTTongCong').textContent = formattedWithVND;
}

// Gọi hàm để tính và hiển thị tổng
calculateTotalFromSessionStorage();




// Xử lý sự kiện khi người dùng nhấn nút "Tìm Kiếm"
function timKiemHangPhongTrong() {
    // Lấy giá trị từ các input trong form
    let ngayNhan = $('#ngayNhan').val();  // Ngày nhận
    let ngayTra = $('#ngayTra').val();    // Ngày trả
    const mucGia = $('#mucGia').val();    // Mức giá
    const soGiuong = $('#soGiuong').val(); // Số giường

    console.log("Ngày nhận (raw): ", ngayNhan);
    console.log("Ngày trả (raw): ", ngayTra);
    console.log("Mức giá: ", mucGia);
    console.log("Số giường: ", soGiuong);

    // Hàm chuyển đổi từ định dạng "DD-MM-YYYY" sang "YYYY-MM-DD"
    function convertDateFormat(dateString) {
        const dateParts = dateString.split('-'); // Tách chuỗi theo dấu "-"
        const day = dateParts[0];   // Lấy phần ngày
        const month = dateParts[1]; // Lấy phần tháng
        const year = dateParts[2];  // Lấy phần năm
        return `${year}-${month}-${day}`; // Trả về định dạng "YYYY-MM-DD"
    }

    // Chuyển đổi ngày nhận và ngày trả nếu có dữ liệu
    if (ngayNhan) {
        ngayNhan = convertDateFormat(ngayNhan);
    }
    if (ngayTra) {
        ngayTra = convertDateFormat(ngayTra);
    }

    console.log("Ngày nhận (converted): ", ngayNhan);
    console.log("Ngày trả (converted): ", ngayTra);

    // Xử lý giá phòng: chuyển đổi giá theo các lựa chọn
    let minPrice = null;
    let maxPrice = null;
    if (mucGia === '500000') {
        minPrice = 500000;
    } else if (mucGia === '500000-1000000') {
        minPrice = 500000;
        maxPrice = 1000000;
    } else if (mucGia === '1000000-2000000') {
        minPrice = 1000000;
        maxPrice = 2000000;
    } else if (mucGia === '2000000-4000000') {
        minPrice = 2000000;
        maxPrice = 4000000;
    } else if (mucGia === '5000000') {
        minPrice = 5000000;
    }

    console.log("Mức giá sau khi xử lý:", minPrice, maxPrice);

    // Gửi yêu cầu tới API để tìm kiếm các phòng trống
    $.ajax({
        url: '/KhachHang/DatPhongOnl/GetAvailableRooms',  // Đường dẫn tới API
        method: 'GET',
        data: {
            ngayNhan: ngayNhan,  // Ngày nhận đã chuyển đổi
            ngayTra: ngayTra,    // Ngày trả đã chuyển đổi
            minPrice: minPrice,  // Mức giá tối thiểu
            maxPrice: maxPrice,  // Mức giá tối đa
            minBeds: soGiuong,   // Số giường (tương đương minBeds vì chỉ chọn 1 giá trị)
            maxBeds: soGiuong    // Số giường
        },
        success: function (response) {
            if (response.length === 0) {
                console.log("Không có phòng");
                // Thêm code xử lý không có phòng, có thể thông báo cho người dùng
            } else {
                var so = 0;
                console.log("Dữ liệu phòng:", response);
                document.getElementById("DatPhongOnline").replaceChildren();
                response.forEach(function (room) {
                    const cardHtml = `
                                <div class="container rounded d-flex p-3 shadow-item mt-${so}" style="background: white;">
                            <div class="col-5">
                                <div class="item rounded image-container">
                                    <img src="${room.anhHangPhong}" alt="" class="img-fluid rounded">
                                </div>
                            </div>
                            <div class="col-7">
                                <div class="ms-3">
                                    <h5>${room.tenHangPhong}</h5>
                                    <div class="d-flex mt-2">
                                        <div>
                                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.83333 7H14.1667C14.6267 7 15 7.37333 15 7.83333V11L15.5 10.5H0.5L1 11V7.83333C1 7.37333 1.37333 7 1.83333 7ZM1.83333 6C1.3471 6 0.880788 6.19315 0.536971 6.53697C0.193154 6.88079 0 7.3471 0 7.83333L0 11C0 11.276 0.224 11.5 0.5 11.5H15.5C15.6326 11.5 15.7598 11.4473 15.8536 11.3536C15.9473 11.2598 16 11.1326 16 11V7.83333C16 7.3471 15.8068 6.88079 15.463 6.53697C15.1192 6.19315 14.6529 6 14.1667 6H1.83333ZM0 11V13C0 13.1326 0.0526784 13.2598 0.146447 13.3536C0.240215 13.4473 0.367392 13.5 0.5 13.5C0.632608 13.5 0.759785 13.4473 0.853553 13.3536C0.947322 13.2598 1 13.1326 1 13V11C1 10.8674 0.947322 10.7402 0.853553 10.6464C0.759785 10.5527 0.632608 10.5 0.5 10.5C0.367392 10.5 0.240215 10.5527 0.146447 10.6464C0.0526784 10.7402 0 10.8674 0 11H0ZM15 11V13C15 13.1326 15.0527 13.2598 15.1464 13.3536C15.2402 13.4473 15.3674 13.5 15.5 13.5C15.6326 13.5 15.7598 13.4473 15.8536 13.3536C15.9473 13.2598 16 13.1326 16 13V11C16 10.8674 15.9473 10.7402 15.8536 10.6464C15.7598 10.5527 15.6326 10.5 15.5 10.5C15.3674 10.5 15.2402 10.5527 15.1464 10.6464C15.0527 10.7402 15 10.8674 15 11ZM14.5 6.5V2C14.5 1.60218 14.342 1.22064 14.0607 0.93934C13.7794 0.658035 13.3978 0.5 13 0.5H3C2.60218 0.5 2.22064 0.658035 1.93934 0.93934C1.65804 1.22064 1.5 1.60218 1.5 2V6.5C1.5 6.63261 1.55268 6.75979 1.64645 6.85355C1.74021 6.94732 1.86739 7 2 7C2.13261 7 2.25979 6.94732 2.35355 6.85355C2.44732 6.75979 2.5 6.63261 2.5 6.5V2C2.5 1.86739 2.55268 1.74021 2.64645 1.64645C2.74021 1.55268 2.86739 1.5 3 1.5H13C13.1326 1.5 13.2598 1.55268 13.3536 1.64645C13.4473 1.74021 13.5 1.86739 13.5 2V6.5C13.5 6.63261 13.5527 6.75979 13.6464 6.85355C13.7402 6.94732 13.8674 7 14 7C14.1326 7 14.2598 6.94732 14.3536 6.85355C14.4473 6.75979 14.5 6.63261 14.5 6.5ZM5.66667 4.5H10.3333C10.3775 4.5 10.4199 4.51756 10.4512 4.54882C10.4824 4.58007 10.5 4.62246 10.5 4.66667V6.5L11 6H5L5.5 6.5V4.66667C5.5 4.62246 5.51756 4.58007 5.54882 4.54882C5.58007 4.51756 5.62246 4.5 5.66667 4.5ZM5.66667 3.5C5.35725 3.5 5.0605 3.62292 4.84171 3.84171C4.62292 4.0605 4.5 4.35725 4.5 4.66667V6.5C4.5 6.776 4.724 7 5 7H11C11.1326 7 11.2598 6.94732 11.3536 6.85355C11.4473 6.75979 11.5 6.63261 11.5 6.5V4.66667C11.5 4.35725 11.3771 4.0605 11.1583 3.84171C10.9395 3.62292 10.6428 3.5 10.3333 3.5H5.66667Z"
                                                      fill="black" fill-opacity="0.6"></path>
                                            </svg>
                                            <span> ${room.soGiuong} giường</span>
                                        </div>
                                        <div class="mx-3">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.49978 15.5V5.00002C2.49978 4.86741 2.4471 4.74024 2.35333 4.64647C2.25956 4.5527 2.13239 4.50002 1.99978 4.50002C1.86717 4.50002 1.73999 4.5527 1.64622 4.64647C1.55246 4.74024 1.49978 4.86741 1.49978 5.00002V15.5C1.49978 15.6326 1.55246 15.7598 1.64622 15.8536C1.73999 15.9473 1.86717 16 1.99978 16C2.13239 16 2.25956 15.9473 2.35333 15.8536C2.4471 15.7598 2.49978 15.6326 2.49978 15.5ZM0.146444 14.3534L1.64644 15.8534C1.74019 15.947 1.86728 15.9996 1.99978 15.9996C2.13228 15.9996 2.25936 15.947 2.35311 15.8534L3.85311 14.3534C3.90224 14.3076 3.94164 14.2524 3.96896 14.191C3.99629 14.1297 4.01099 14.0635 4.01217 13.9964C4.01336 13.9292 4.00101 13.8626 3.97586 13.8003C3.95071 13.738 3.91328 13.6815 3.8658 13.634C3.81832 13.5865 3.76177 13.5491 3.69951 13.5239C3.63725 13.4988 3.57056 13.4864 3.50343 13.4876C3.43629 13.4888 3.37008 13.5035 3.30875 13.5308C3.24742 13.5582 3.19222 13.5976 3.14644 13.6467L1.64644 15.1467H2.35311L0.85311 13.6467C0.758327 13.5584 0.632963 13.5103 0.503429 13.5126C0.373895 13.5149 0.250304 13.5673 0.158696 13.6589C0.067087 13.7506 0.0146124 13.8741 0.0123269 14.0037C0.0100414 14.1332 0.0581236 14.2586 0.146444 14.3534V14.3534ZM3.85311 6.14669L2.35311 4.64669C2.25936 4.55305 2.13228 4.50046 1.99978 4.50046C1.86728 4.50046 1.74019 4.55305 1.64644 4.64669L0.146444 6.14669C0.097319 6.19246 0.0579175 6.24766 0.0305896 6.309C0.00326158 6.37033 -0.011433 6.43654 -0.0126175 6.50367C-0.013802 6.57081 -0.00145225 6.63749 0.0236951 6.69975C0.0488424 6.76201 0.0862722 6.81857 0.133751 6.86605C0.181231 6.91353 0.237786 6.95096 0.300045 6.9761C0.362304 7.00125 0.42899 7.0136 0.496125 7.01242C0.563261 7.01123 0.62947 6.99654 0.690802 6.96921C0.752135 6.94188 0.807336 6.90248 0.85311 6.85335L2.35311 5.35335H1.64644L3.14644 6.85335C3.19222 6.90248 3.24742 6.94188 3.30875 6.96921C3.37008 6.99654 3.43629 7.01123 3.50343 7.01242C3.57056 7.0136 3.63725 7.00125 3.69951 6.9761C3.76177 6.95096 3.81832 6.91353 3.8658 6.86605C3.91328 6.81857 3.95071 6.76201 3.97586 6.69975C4.00101 6.63749 4.01336 6.57081 4.01217 6.50367C4.01099 6.43654 3.99629 6.37033 3.96896 6.309C3.94164 6.24766 3.90224 6.19246 3.85311 6.14669ZM4.99978 2.50002H15.4998C15.6324 2.50002 15.7596 2.44734 15.8533 2.35357C15.9471 2.25981 15.9998 2.13263 15.9998 2.00002C15.9998 1.86741 15.9471 1.74024 15.8533 1.64647C15.7596 1.5527 15.6324 1.50002 15.4998 1.50002H4.99978C4.86717 1.50002 4.73999 1.5527 4.64622 1.64647C4.55246 1.74024 4.49978 1.86741 4.49978 2.00002C4.49978 2.13263 4.55246 2.25981 4.64622 2.35357C4.73999 2.44734 4.86717 2.50002 4.99978 2.50002ZM6.14644 0.146688L4.64644 1.64669C4.55281 1.74044 4.50022 1.86752 4.50022 2.00002C4.50022 2.13252 4.55281 2.2596 4.64644 2.35335L6.14644 3.85335C6.19222 3.90248 6.24742 3.94188 6.30875 3.96921C6.37009 3.99654 6.43629 4.01123 6.50343 4.01242C6.57056 4.0136 6.63725 4.00125 6.69951 3.9761C6.76177 3.95096 6.81832 3.91353 6.8658 3.86605C6.91328 3.81857 6.95071 3.76201 6.97586 3.69975C7.00101 3.63749 7.01336 3.57081 7.01217 3.50367C7.01099 3.43654 6.99629 3.37033 6.96897 3.309C6.94164 3.24766 6.90224 3.19246 6.85311 3.14669L5.35311 1.64669V2.35335L6.85311 0.853354C6.90224 0.80758 6.94164 0.752379 6.96897 0.691047C6.99629 0.629714 7.01099 0.563505 7.01217 0.496369C7.01336 0.429234 7.00101 0.362548 6.97586 0.300289C6.95071 0.238031 6.91328 0.181475 6.8658 0.133995C6.81832 0.0865163 6.76177 0.0490866 6.69951 0.0239392C6.63725 -0.00120811 6.57056 -0.0135579 6.50343 -0.0123734C6.43629 -0.0111888 6.37009 0.00350572 6.30875 0.0308337C6.24742 0.0581617 6.19222 0.0975632 6.14644 0.146688V0.146688ZM14.3531 3.85335L15.8531 2.35335C15.9467 2.2596 15.9993 2.13252 15.9993 2.00002C15.9993 1.86752 15.9467 1.74044 15.8531 1.64669L14.3531 0.146688C14.3073 0.0975632 14.2521 0.0581617 14.1908 0.0308337C14.1295 0.00350572 14.0633 -0.0111888 13.9961 -0.0123734C13.929 -0.0135579 13.8623 -0.00120811 13.8 0.0239392C13.7378 0.0490866 13.6812 0.0865163 13.6338 0.133995C13.5863 0.181475 13.5488 0.238031 13.5237 0.300289C13.4985 0.362548 13.4862 0.429234 13.4874 0.496369C13.4886 0.563505 13.5033 0.629714 13.5306 0.691047C13.5579 0.752379 13.5973 0.80758 13.6464 0.853354L15.1464 2.35335V1.64669L13.6464 3.14669C13.5581 3.24147 13.51 3.36684 13.5123 3.49637C13.5146 3.6259 13.5671 3.74949 13.6587 3.8411C13.7503 3.93271 13.8739 3.98519 14.0034 3.98747C14.133 3.98976 14.2583 3.94167 14.3531 3.85335V3.85335ZM6.99978 8.70002V13.5C6.99978 13.8978 7.15781 14.2794 7.43912 14.5607C7.72042 14.842 8.10195 15 8.49978 15H12.4998C12.8976 15 13.2791 14.842 13.5604 14.5607C13.8417 14.2794 13.9998 13.8978 13.9998 13.5V8.70002C13.9998 8.56741 13.9471 8.44024 13.8533 8.34647C13.7596 8.2527 13.6324 8.20002 13.4998 8.20002C13.3672 8.20002 13.24 8.2527 13.1462 8.34647C13.0525 8.44024 12.9998 8.56741 12.9998 8.70002V13.5C12.9998 13.6326 12.9471 13.7598 12.8533 13.8536C12.7596 13.9473 12.6324 14 12.4998 14H8.49978C8.36717 14 8.23999 13.9473 8.14622 13.8536C8.05246 13.7598 7.99978 13.6326 7.99978 13.5V8.70002C7.99978 8.56741 7.9471 8.44024 7.85333 8.34647C7.75956 8.2527 7.63239 8.20002 7.49978 8.20002C7.36717 8.20002 7.23999 8.2527 7.14622 8.34647C7.05246 8.44024 6.99978 8.56741 6.99978 8.70002V8.70002ZM15.8344 10.1287L11.5031 6.22869C11.2277 5.98086 10.8703 5.84373 10.4998 5.84373C10.1293 5.84373 9.77187 5.98086 9.49644 6.22869L5.16511 10.1287C5.06981 10.2183 5.0134 10.3416 5.00799 10.4723C5.00257 10.603 5.04858 10.7306 5.13615 10.8277C5.22371 10.9249 5.34586 10.9839 5.4764 10.992C5.60694 11.0002 5.73547 10.9569 5.83444 10.8714L10.1658 6.97135C10.2575 6.88899 10.3765 6.84344 10.4998 6.84344C10.6231 6.84344 10.742 6.88899 10.8338 6.97135L15.1651 10.8714C15.2641 10.9569 15.3926 11.0002 15.5232 10.992C15.6537 10.9839 15.7758 10.9249 15.8634 10.8277C15.951 10.7306 15.997 10.603 15.9916 10.4723C15.9862 10.3416 15.9297 10.2183 15.8344 10.1287Z"
                                                      fill="black" fill-opacity="0.6"></path>
                                            </svg>
                                            <span> ${room.dienTich}<sup>2</sup></span>
                                        </div>
                                    </div>

                                    <div class="d-flex mt-3 align-items-center">
                                        <div class="">
                                            <img width="20" height="20"
                                                 src="https://booking.muongthanh.com/images/rooms/service/2024/03/original/voi-sen_1709957719.png"
                                                 alt="Vòi sen">
                                        </div>
                                        <div class="ms-3">
                                            <img width="20" height="20"
                                                 src="https://booking.muongthanh.com/images/rooms/service/2024/03/original/sheet_1709958228.png"
                                                 alt="Ga trải giường, gối">
                                        </div>
                                        <div class="ms-3">
                                            <img width="20" height="20"
                                                 src="https://booking.muongthanh.com/images/rooms/service/2024/03/original/no-smoking_1709957396.png"
                                                 alt="Phòng không hút thuốc">
                                        </div>
                                        <a class="ms-3 cusor" data-bs-toggle="modal" data-bs-target="#modal1"
                                           style="color: darkblue; font-style: italic;">Xem tất cả tiện nghi</a>
                                    </div>
                                    <div class="d-flex mt-5 ">
                                        <div class="col-6">
                                            <div class="">
                                                <h6 class="mb-0">Giá chỉ từ: </h6>
                                            </div>
                                            <div style="font-size: larger;">
                                                <span class="text-color textTitleRoom">
                                                    ${new Intl.NumberFormat('en-US').format(room.giaHangPhong)} VND/ đêm
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-6 d-flex mt-1 justify-content-end align-items-end">
                                            <button type="button" onclick="loadHangPhong('${room.maHangPhong}')" class="btn bg-color"
                                                    style="font-size: small;color: white;width: 140px; height: 40px;font-weight: 600;">
                                                Chọn
                                                phòng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    // Thêm phòng vào trong phần tử rooms-container
                    $('#DatPhongOnline').append(cardHtml);
                    so = 3;
                });
            }
        },
        error: function (xhr, status, error) {
            alert('Không có phòng.');
        }

    });
};


function reset() {
    document.getElementById("ngayNhan").value = "";
    document.getElementById("ngayTra").value = "";
    document.getElementById("mucGia").selectedIndex = "";
    document.getElementById("soGiuong").selectedIndex = "";
}