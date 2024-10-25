function runScripts() {
    // Tìm tất cả các thẻ script trong nội dung mới
    var scripts = document.querySelectorAll('#content script');
    scripts.forEach(function (script) {
        // Tạo một thẻ script mới
        var newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;  // Nếu script có src, gán src
        } else {
            newScript.textContent = script.textContent;  // Nếu script có nội dung, gán nội dung
        }
        document.body.appendChild(newScript); // Thêm thẻ script vào body để thực thi
    });
}

function loadContent(url) {
    var xhr = new XMLHttpRequest();  // Tạo đối tượng XMLHttpRequest

    xhr.open('GET', url, true);  // Thiết lập yêu cầu GET tới URL

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Khi yêu cầu hoàn tất và thành công, thay đổi nội dung
                document.getElementById('content').innerHTML = xhr.responseText;
                runScripts(); // Gọi hàm để chạy các script
            } else {
                // Xử lý lỗi nếu không tải được trang
                document.getElementById('content').innerHTML = "<p>Failed to load content. Please try again.</p>";
            }
        }
    };

    xhr.send();  // Gửi yêu cầu AJAX
}

