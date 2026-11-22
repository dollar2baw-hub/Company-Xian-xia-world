# Tu Tiên Công Nghiệp - Tiên Môn Sản Nghiệp

Trò chơi mô phỏng quản lý tài nguyên, sản xuất công nghiệp và giao thương tu chân giới với phong cách đồ họa Pixel.

---

## Tổng Hợp Các Prompt Thiết Kế

Dưới đây là toàn bộ các prompt yêu cầu đã được gửi trong quá trình xây dựng trò chơi:

### Prompt 1: Ý tưởng cốt lõi, nghề nghiệp & đồ họa Pixel

> Tạo 1 trò chơi tu tiên công nghiệp quản lý tài nguyên, buôn bán vật phẩm, người chơi khi bắt đầu có thể chọn các nghề nghiệp như:
>
> Luyện khí
> (Luyện khí sư)
> Luyện đan dược
> (Luyện đan sư)
> Khoáng mỏ
> Dược điền
> (Khoáng công)
> (Dược công)
> Luyện bảo
> (Luyện bảo sư)
>
> Luyện khí là việc chế tạo ra các loại binh khí, vũ khí, công cụ từ các nguyên liệu (kiếm, cung, khiên,...)
>
> Luyện đan dược là luyện ra các loại linh đan diệu dược giúp bổ trợ, tăng trưởng sức mạnh (khí huyết đan, bổ khí đan, thuốc hồi máu...)
>
> Luyện bảo là luyện ra các bảo vật, vật phẩm có tác dụng bổ trợ cho tu sĩ (túi trữ vật, nhẫn, vòng cổ,...)
>
> Khoáng mỏ là các mỏ chứa khoáng sản, nguyên liệu cho việc luyện khí, người chơi sẽ sử dụng các khoáng công để khai thác khoáng sản từ đó, sau đó bán lại cho các xưởng luyện khí
>
> Dược điền là các vườn trồng linh thảo, thảo dược cung cấp cho các xưởng luyện đan, dược công là những người làm công việc trồng, chăm sóc và thu hoạch thảo dược ở dược điền.
>
> Người chơi khi bắt đầu sẽ được chọn 1 trong các nghề: Luyện khí, Luyện đan, trồng dược và khai khoáng.
>
> Luyện khí sư, luyện đan sư,... Giống như công nhân, làm việc trong các xưởng, địa điểm người chơi chọn.
>
> Khi đã chọn nghề, các nghề sẽ có các giao diện thao tác khác nhau 
>
> Những vấn đề chung cho các nghề mà người chơi cần chú ý: nguyên liệu, nhân lực và vật sản xuất.
>
> Nghề luyện khí sử dụng Luyện khí sư và lò luyện để sản xuất 
>
> Nghề luyện đan dược sử dụng đan lô và Luyện đan sư 
>
> Nghề Luyện bảo dùng Luyện bảo sư cùng lò luyện
>
> Khai khoáng dùng khoáng công và Dược điền dùng dược công.
>
> Đồ họa Pixel, generate các asset phù hợp

---

### Prompt 2: Chi tiết cơ chế vận hành, thị trường, phẩm chất, trả lương & giao diện xưởng

> Cơ chế hoạt động:
>
> I. Tab chung: nằm sau các tab chính:
>
> 1. Thị trường - có các hạng mục:
>  a. Tất cả: toàn bộ sản phẩm đang bán.
>  b. Khoáng sản: các loại khoáng sản của Khai khoáng.
>  c. Dược liệu: các loại dược liệu của Dược điền.
>  d. Khí cụ: các loại sản phẩm của luyện khí.
>  e. Đan dược: các loại đan, dược của luyện đan.
>  f. Trang sức: sản phẩm của Luyện bảo.
>  1.1: sắp xếp - người chơi có thể sắp xếp theo: giá cả; phẩm chất.
> 1.2: mua - bán: trong thị trường, người chơi có thể mua các sản phẩm ở trong và có thể chọn mục rao bán: khi bấm vào rao bán, người chơi sẽ chọn loại vật phẩm muốn bán, số lượng và giá cả; hệ thống sẽ đưa ra các gợi ý theo thông tin từ thị trường (giá cả, xu hướng , cung cầu,...) xem những gì người chơi đưa ra có thể bán được không (người chơi không thể bán các sản phẩm trực tiếp trong kho.
>
> 2. Đơn hàng, khách hàng - tab này là nơi mà người chơi liên kết với những người chơi khác, khi người khác mua hàng của mình từ thị trường, họ có thể kết bạn với mình, sau đó có thể đặt các đơn hàng của họ ở xưởng mình, đây là nguồn khách hàng ổn định nhất, không phải chờ người ngẫu nhiên mua hàng của mình trong thị trường.
>
> II. Phẩm chất vật phẩm:
>  → phân loại từ : Phàm cấp → Huyền cấp → Hoàng cấp → Địa cấp → Thiên cấp.
>   - mỗi cấp chia ra các bậc: nhất tinh → cửu tinh.
>   Phẩm chất vật phẩm được quyết định bởi phẩm chất của công cụ sản xuất và chất lượng nhân lực, vd: lò luyện cao cấp + nhân lực lão luyện có tỉ lệ cao sản xuất ra vật phẩm chất lượng cao,...
>
> III. Trả lương: thay vì chơi theo ngày, game có cơ chế trả lương:
>   1. Một dòng timeline nhỏ sẽ chạy, mỗi 1h30p (thời gian thực), dòng timeline sẽ chạy đầy, một thông báo sẽ hiện lên, nhắc người chơi trả lương cho nhân lực, mức lương dựa vào các thông tin như phẩm cấp nhân lực, mức độ công việc (nặng nhọc, độc hại,...), tay nghề của nhân lực,... Mỗi người có một mức lương khác nhau, người chơi phải đảm bảo đủ linh thạch để trả cho họ.
>
> IV. Nhân Lực: tab này có sự thay đổi tùy vào lựa chọn của người chơi về nghề nghiệp ban đầu, khi bấm vào chung chung sẽ có tên, cảnh giới (nếu là tu sĩ), chỉ số,... Và mức lương phải trả mỗi chu kỳ 1h30p, người chơi có thể xem chi tiết lương của họ được tính từ những hạng mục nào.
>
> V. Không thể tua nhanh thời gian.
>
> ⭐Khi chọn luyện khí, người chơi sẽ lập tức tiến vào giao diện chính: 
>
> I. Xưởng Luyện khí - thông tin sẽ xuất hiện là:
>
> 1. Luyện khí sư ( số nhân công đang có)
>
> 2. Kho (tab đóng, khi bấm vào sẽ mở ra tab 'nguyên liệu' để xem các nguyên liệu đang có, bên cạnh tab nguyên liệu là tab 'sản phẩm' ấn vào để đổi tab xem các sản phẩm đã tạo);
>
> 3. Bên dưới là các lò đang sở hữu và cấp độ, khi bấm vào 1 lò, các công thức sản xuất các vật phẩm có thể luyện sẽ hiện ra, người chơi có thể chọn sản xuất vô hạn (sản xuất một sản phẩm nào đó không giới hạn số lượng), sản xuất theo số lượng (đặt một số lượng giới hạn để sản xuất, đủ số lượng sẽ dừng lại - người chơi có thể đặt một chuỗi sản xuất để sản xuất các sản phẩm khác nhau một cách tự động, vd: sx 10 kiếm → đủ số lượng → sản xuất 10 cung → ... Người chơi có thể chọn lặp lại vô hạn hoặc vài lần sau đó dừng lại) - Người chơi cần đảm bảo nguyên liệu để sản xuất, nếu nguyên liệu không đủ thì Luyện khí sư sẽ dừng công việc đến khi nguyên liệu đủ.
>
> 3.1: Chỉ định Luyện Khí Sư: người chơi khi đang bấm vào xem lò ngoài việc có thể chọn vật phẩm sản xuất còn có thể chọn luyện khí sư sẽ làm việc trong đó, số lượng Luyện khí sư cùng cấp bậc của họ có thể quyết định đến thời gian sản phẩm và chất lượng sản phẩm.
>
> 4. Nâng cấp: người chơi có thể nâng cấp lò để tăng hiệu suất làm việc và chất lượng sản phẩm, thêm Luyện khí sư làm việc tại lò,...
>
> II. Nhân lực: Mục này nằm bên cạnh mục xưởng luyện khí, các thông tin sau sẽ xuất hiện:
>
> 1. Danh sách các luyện khí sư đã chiêu mộ, người chơi có thể xem thông tin như: tên, cảnh giới (nếu là tu sĩ), lò mà họ đang hoạt động , các chỉ số (hiệu suất, đặc biệt,...), Thiên phú (tỉ lệ xuất hiện người có thiên phú ≈ 5%), cuối cùng là trục xuất (đuổi họ rời khỏi xưởng).
> 1.1. chỉ số đặc biệt và thiên phú: cực hiếm, đem lại các buff bổ trợ cho công việc.
>
> 2. Chiêu mộ: trong mục nhân lực cũng có danh sách các nhân lực đang muốn tìm việc, người chơi sẽ bỏ linh thạch ra mua, giá cả dựa vào các chỉ số của người muốn mua.
>
> Các nghề nghiệp khác cũng có cơ chế gần giống luyện khí, chỉ có các hạng mục của mỗi nghề là khác nhau.
>
> Nghề khai khoáng làm việc trong các mỏ
>
> Nghề Trồng dược làm việc tại các vườn
>
> Nghề Luyện đan, bảo cũng vậy

---

### Prompt 3: Tổng hợp tài liệu

> Tập hợp các prompt tôi đã gửi, tạo 1 file readme trong mã để tôi push lên github, không thay đổi gì trong app

---

## Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite
- **Giao diện**: Tailwind CSS v4, Lucide React, Canvas Confetti, Pixel Art Canvas
- **Âm thanh**: Web Audio API (8-bit Retro Synthesizer)

## Chạy Dự Án Cục Bộ

```bash
npm install
npm run dev
```

Build sản phẩm:

```bash
npm run build
```
