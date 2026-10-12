# Website Phúc Khang Thịnh Phát

Website HTML/CSS/JavaScript thuần, tông đen – vàng kim. Toàn bộ website chạy trực tiếp trên GitHub Pages, không cần Node.js, npm hay bước build.

## Có trong bộ mã nguồn

- Trang chủ với Layered Glassmorphism và Bento Grid; nền parallax nhẹ, tương tác hover nhỏ, tự giảm chuyển động theo cài đặt thiết bị.
- Giới thiệu đầy đủ nội dung định vị, sứ mệnh và quy trình của công ty.
- 32 gợi ý sản phẩm, 10 nhóm, tìm kiếm không dấu, bộ lọc và trang chi tiết riêng.
- Danh sách yêu cầu báo giá: chọn mẫu, đổi số lượng, xóa và sao chép.
- Giải pháp, dịch vụ, các trang khách sạn/resort, Tết, Trung thu và 20/10.
- Cẩm nang với 3 bài viết, FAQ, liên hệ, nút gọi/Zalo/bản đồ, dự trù ngân sách.
- Logo, ảnh trích từ tài liệu công ty, video đã nén, catalog PowerPoint tải về.
- Giao diện thích ứng điện thoại/máy tính, metadata SEO, schema tổ chức và công cụ tạo sitemap.

## Đưa lên GitHub Pages

1. Giải nén bộ mã nguồn.
2. Tạo repository, ví dụ `phuc-khang-thinh-phat`.
3. Đưa **các tệp bên trong thư mục đã giải nén** vào gốc repository. `index.html` phải nằm ngay ở gốc, cùng `assets/`, `san-pham/` và `cam-nang/`.
4. Nếu tải qua trình duyệt, có thể tải nhóm trang HTML trước, rồi tải thư mục `assets/` trong lần tiếp theo. Giữ nguyên cấu trúc và tên tệp.
5. Vào **Settings → Pages → Build and deployment → Source → Deploy from a branch**. Chọn nhánh **main**, thư mục **/(root)** rồi **Save**.
6. Mở đường dẫn GitHub Pages được GitHub cung cấp sau khi triển khai hoàn tất.

Nguồn hướng dẫn: [GitHub Docs — cấu hình nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Các đường dẫn nội bộ là đường dẫn tương đối nên dùng được cả ở `username.github.io/ten-repo/` và tên miền riêng. Giữ tệp `.nojekyll` được kèm trong gói.

## Chỉnh sửa thông tin

| Nội dung | Tệp |
| --- | --- |
| Hotline, email, địa chỉ, Zalo | `assets/config.js` |
| Màu, khoảng cách, hiệu ứng, kích thước chữ | `assets/styles.css` |
| Danh sách tìm kiếm, nhóm, tên và ảnh sản phẩm | `assets/catalog.js` |
| Nội dung trang chủ | `index.html` |
| Nội dung giới thiệu | `gioi-thieu.html` |
| Dịch vụ và giải pháp | `dich-vu.html`, `giai-phap.html` |
| Chi tiết sản phẩm | `san-pham/<ten-san-pham>.html` |
| Bài cẩm nang | `cam-nang/<ten-bai>.html` |

Khi đổi thông tin công ty, cập nhật cả phần nội dung HTML, metadata và schema ở đầu các trang để thông tin hiện đúng cả khi JavaScript chưa chạy. Khi sửa sản phẩm, cập nhật `assets/catalog.js` và trang chi tiết tương ứng; đường dẫn ảnh bắt đầu bằng `assets/`.

## Form tư vấn hoạt động như thế nào?

Cấu hình hiện tại **soạn email** gửi tới `pkgift.sales@gmail.com`; khách hàng phải bấm **Gửi** trong ứng dụng email. Website chỉ lưu mã sản phẩm và số lượng trong trình duyệt để giữ danh sách báo giá. Website không có máy chủ nhận form, không tự gửi email và không có trang quản trị đơn hàng.

Nếu máy của khách chưa cấu hình ứng dụng email, form vẫn cho phép sao chép hoặc tải nội dung yêu cầu để gửi thủ công, hoặc liên hệ bằng Zalo/hotline.

Muốn tự động nhận form, kết nối một dịch vụ nhận form đã cấu hình rồi đặt URL HTTPS của dịch vụ vào `formEndpoint` trong `assets/config.js`. Khi làm bước đó cần đồng thời cập nhật mô tả form và trang bảo mật cho phù hợp. Không đặt API key hay mật khẩu vào mã JavaScript công khai. GitHub Pages chỉ phục vụ các tệp tĩnh; phần xử lý máy chủ cần một dịch vụ riêng.

## Đặt URL chính thức cho SEO

Gói GitHub không giữ canonical của bản Sites để tránh hướng công cụ tìm kiếm về sai website. Sau khi có URL GitHub Pages hoặc tên miền riêng, có thể dùng công cụ tùy chọn:

```sh
python tools/set-site-url.py https://username.github.io/ten-repo
```

Công cụ cập nhật canonical, URL chia sẻ, schema, robots và sitemap. Sau đó commit/push các tệp đã cập nhật. Website vẫn chạy được trước khi thực hiện bước SEO này.

## Kiểm tra trước khi dùng chính thức

Mã JavaScript, liên kết tệp, nhãn form, ảnh, nội dung định vị và các hàm tìm kiếm/báo giá đã được kiểm tra. Chưa kiểm tra giao diện trực tiếp bằng trình duyệt trong môi trường tạo website. Sau khi đưa lên GitHub, mở thử trên điện thoại và máy tính; thử tìm sản phẩm, đổi số lượng, mở video và soạn email bằng tài khoản của bạn.

Giá và thông số cụ thể không được giả định. Hình sản phẩm là mẫu tham khảo từ tài liệu công ty; mẫu thực tế, giá, in ấn, bảo hành và tiến độ cần xác nhận theo từng đơn hàng. Catalog tải về là tệp PowerPoint gốc được cung cấp, không phải một catalog đã biên tập lại.

Font được lưu cùng website, không cần tải từ Google Fonts. Bản quyền và giấy phép font nằm trong `assets/FONT_LICENSE.txt`.
