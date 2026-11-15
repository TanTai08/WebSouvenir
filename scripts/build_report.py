"""Xuất báo cáo kỹ thuật hiện trạng 15 trang. Cần pip install reportlab python-docx ngoài runtime ứng dụng."""
from pathlib import Path
import json,csv,subprocess
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
root=Path(__file__).resolve().parents[1];out=root/'reports';team=json.loads((root/'config/team.json').read_text())
import os
font_candidates=[os.environ.get('REPORT_FONT',''),'/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','C:/Windows/Fonts/arial.ttf','/System/Library/Fonts/Supplemental/Arial.ttf']
font=next((f for f in font_candidates if f and Path(f).is_file()),None)
if not font:raise FileNotFoundError('Set REPORT_FONT to a Unicode TrueType font path.')
pdfmetrics.registerFont(TTFont('VN',font));styles=getSampleStyleSheet()
for st in styles.byName.values():st.fontName='VN'
styles['Normal'].fontSize=10;styles['Normal'].leading=16;styles['Title'].fontSize=20;styles['Heading1'].fontSize=16;styles['Heading2'].fontSize=12
pages=[]
def page(title,paras,headers=None,rows=None):pages.append((title,paras,headers,rows))
page('Chương 1 — Tổng quan dự án',[
'GiftShop / WebSouvenir là website quản lý nội bộ cửa hàng bán đồ lưu niệm. Bản báo cáo này ghi nhận hiện trạng kỹ thuật của phiên bản 0.4.0; không khẳng định dự án đã hoàn tất học kỳ hoặc đã được nghiệm thu.',
'Nhóm đã chọn Pathway 1 và định hướng Agile/Scrum. Các trường môn chuyên ngành kế thừa, hạn nộp, stakeholder, họ tên và MSSV được để trống theo yêu cầu của PM để hoàn thiện sau. Chưa có kết quả khảo sát cửa hàng; các khó khăn về quản lý thủ công mới là giả thuyết cần xác minh.',
'Phần mềm đã có backend, cơ sở dữ liệu lưu trên máy chủ, xác thực và phân quyền. Sản phẩm không phải giao diện tĩnh. Tuy nhiên chưa có URL production HTTPS được xác nhận, vì vậy điều kiện sản phẩm triển khai công khai chưa hoàn thành.',
'Các phần sau phân biệt rõ kết quả đã kiểm thử, cấu hình đã tạo và hoạt động cần con người thực hiện. Bằng chứng trực tuyến được lưu tại repo TanTai08/WebSouvenir, Pull Request #1 và GitHub Actions. Phiên bản đã được sinh với hỗ trợ Codex; không gán lịch sử commit cho các thành viên chưa tham gia.'
],['Trường','Giá trị'],[['Repo','https://github.com/TanTai08/WebSouvenir'],['PM','@TanTai08'],['Môn kế thừa / hạn nộp','________________ / ________________'],['Người nghiệm thu','________________'],['Trạng thái','Bản kỹ thuật sẵn sàng review; chưa đóng dự án']])
page('Chương 1 — Mục tiêu và ranh giới nghiệp vụ',[
'Phạm vi được triển khai tập trung vào luồng hàng hóa: quản trị viên tạo sản phẩm và nhập hàng, nhân viên bán hàng tại quầy, quản trị viên theo dõi doanh thu và hủy đơn khi cần. Không xây dựng kênh khách hàng đặt mua trực tuyến.',
'Giá được lưu bằng số nguyên VND để tránh sai số tiền thập phân. Tổng đơn được tính từ giá hiện tại trong database, không tin giá do trình duyệt gửi lên. Chi tiết đơn lưu tên và đơn giá tại lúc bán, nên sửa sản phẩm sau đó không đổi lịch sử đơn cũ.',
'Doanh thu trong ứng dụng là tổng đơn trạng thái paid. Đơn cancelled bị loại khỏi doanh thu; chưa có giá vốn, lợi nhuận, thuế, chiết khấu hoặc hóa đơn điện tử. Các chỉ tiêu này cần Change Request nếu stakeholder muốn mở rộng.',
'Mục tiêu chấp nhận kỹ thuật đã được chuyển thành các test API như không âm kho, hoàn kho đúng một lần, kiểm quyền ở server và không tạo trùng đơn khi retry cùng mã. Mục tiêu người dùng và lịch SMART chưa được phê duyệt; không điền số người dùng hoặc thời gian phản hồi giả.'
],['Trong phạm vi','Ngoài phạm vi'],[['Đăng nhập, phân quyền, đổi mật khẩu','Đăng ký khách hàng / SSO trường'],['Sản phẩm, nhập hàng, tồn kho','Đa chi nhánh / giá vốn / lợi nhuận'],['Bán tại quầy, hủy toàn đơn','Thanh toán online / đổi trả từng phần'],['Thống kê và lịch sử','Vận chuyển / app di động / IoT']])
page('Chương 2 — Cơ cấu nhóm 5 người',[
'Thông tin phân công được tập trung tại config/team.json. Có đủ năm vị trí; các tài khoản đã xác nhận gồm PM TanTai08, Technical Lead Txtien-225, Backend LQT23072005 Frontend ngonhat21 và QA Hoangtrong-S1. Các trường để trống là thông tin chưa được cung cấp, không phải thành viên đã được mời.',
'Script scripts/assign_member.py cập nhật từng vị trí bằng username và có thể gán các Issue theo vai trò khi chạy với --apply. Cờ --invite cho phép gửi lời mời cộng tác bằng quyền GitHub của người chạy; script không dùng hay lưu mật khẩu thành viên.',
'Vai trò chuyên môn không đồng nghĩa quyền truy cập GitHub. PM/Backend/QA là trách nhiệm của dự án; quyền read/write/admin là quyền kho mã. Tài khoản admin/staff trong cửa hàng lại phục vụ người vận hành phần mềm, không thay thế danh tính sinh viên.',
'Tỷ lệ đóng góp cuối kỳ cần dựa vào công việc thực tế và được cả nhóm thống nhất, tổng 100%. Không tự điền 20% cho mỗi người, không viết commit thay danh tính và không dùng tài liệu sinh sẵn để chứng minh từng thành viên đã hoàn thành.'
],['Vị trí','GitHub','Trách nhiệm chính'],[[m['role'],('@'+m['github']) if m['github'] else '________________',{'PM':'Phạm vi, lịch, board, risk và stakeholder','Tech Lead':'Kiến trúc, DB, CI, deployment và review','Backend':'API, nghiệp vụ và giao dịch tồn kho','Frontend':'Giao diện, tích hợp và tương tác','QA':'Kiểm thử, UAT và evidence'}[m['role']]] for m in team['members']])
page('Chương 2 — Quy trình và Definition of Done',[
'Nhóm đã chọn Scrum với Sprint dự kiến hai tuần. Đây là thiết kế cách làm, chưa có biên bản cho thấy các sự kiện Scrum đã diễn ra. PM có thể kiêm Scrum Master; vai trò Product Owner cần người chịu trách nhiệm ưu tiên và xác nhận yêu cầu.',
'Mỗi Sprint cần mục tiêu, backlog được lựa chọn và ước lượng bởi nhóm. Daily Scrum diễn ra trong ngày nhóm làm việc để điều chỉnh kế hoạch. Sprint Review kiểm tra increment với stakeholder; Retrospective chọn cải tiến cụ thể, có owner và thời hạn.',
'Luồng kỹ thuật đã chuẩn bị gồm Issue → nhánh làm việc → Pull Request → tự kiểm thử → review của người khác → CI xanh → merge. GitHub Actions đã chạy thành công trên PR #1 ở bản khởi tạo; các thay đổi tiếp theo cần kiểm tra run tương ứng.',
'Definition of Done: tiêu chí chấp nhận được kiểm chứng; không có lỗi nghiêm trọng; PR có ít nhất một reviewer khác; kiểm tra tự động qua; tài liệu liên quan cập nhật; bằng chứng gắn vào Issue. Vì peer review còn chờ, các Issue không tự động được đóng dù đã có bản mã.'
],['Hoạt động','Bằng chứng cần lưu'],[['Planning','Mục tiêu, người tham dự, estimate, scope được chọn'],['Daily','Trở ngại và điều chỉnh được ghi thực tế'],['Review','Bản chạy, phản hồi, Issue phát sinh'],['Retro','4Ls/Sailboat, hành động cải tiến, owner'],['Done','PR, review, CI và QA xác nhận AC']])
page('Chương 3 — WBS và độ bao phủ phạm vi',[
'WBS đã được chuẩn bị theo đầu ra và bao gồm cả quản trị, kỹ thuật, kiểm thử, triển khai và hồ sơ. Quy tắc 100% yêu cầu không bỏ sót các đầu ra đã cam kết, đồng thời không đưa tính năng ngoài phạm vi vào cam kết ngầm.',
'Các gói chức năng được dự kiến từ một đến hai tuần. Công việc quản trị xuyên kỳ được chia theo Sprint để có đầu ra đo được: Sprint plan, snapshot board, risk update, Retro và evidence. Thời lượng dự kiến không được mô tả như số giờ thực tế đã làm.',
'Backlog.csv đã có 20 nhiệm vụ và các Issue tương ứng đã tạo trên GitHub. Mỗi nhiệm vụ có ID, WBS, vai trò, Sprint dự kiến, điểm sơ bộ và tiêu chí chấp nhận. Điểm do trợ lý đề xuất cần nhóm ước lượng lại trước khi dùng làm baseline.',
'Tài liệu WBS riêng đi kèm bộ hồ sơ mô tả chi tiết hơn. Khi thay đổi phạm vi cần cập nhật cả WBS, backlog, estimate, kế hoạch và tiêu chí nghiệm thu; không chỉ sửa một dòng trong báo cáo.'
],['Nhánh WBS','Đầu ra'],[['1.0 Quản trị','Charter, kế hoạch, board, risk, CR, closure'],['2.0 Nền tảng','Kiến trúc, schema, repo, CI và môi trường'],['3.0 Sản phẩm','Xác thực, sản phẩm, nhập kho, bán/hủy, thống kê'],['4.0 Chất lượng','Test API/UI, UAT, deploy, backup/restore'],['5.0 Bàn giao','Báo cáo, evidence, slide và demo']])
page('Chương 3 — Ma trận truy vết yêu cầu',[
'Ma trận dưới đây liên kết chức năng, gói công việc, điểm thực thi và cách kiểm chứng. Đây là truy vết kỹ thuật của phiên bản hiện tại; cột UAT chưa được đánh dấu pass vì chưa có người nghiệm thu thực hiện.',
'AC của nghiệp vụ cần được stakeholder xác nhận, ví dụ quyền ai được hủy đơn, giờ báo cáo và quy định nhập hàng. Bản hiện tại giới hạn hủy đơn cho admin, không cho staff thay giá hoặc nhập hàng và dùng UTC+7 cho ngày doanh thu.',
'Các thao tác bị từ chối phải giữ nguyên dữ liệu. Test đã kiểm tra trường hợp bán quá tồn, trùng dòng sản phẩm và hủy đơn lần hai. Kiểm thử với nhiều dòng có lỗi và thử nghiệm tải thực tế vẫn cần mở rộng theo quy mô người dùng được duyệt.',
'Chức năng hoàn thành kỹ thuật không tự động tương đương nghiệm thu nghiệp vụ. QA cần kiểm tra UI và ghi biên bản theo luồng sử dụng thực, không chỉ đọc kết quả test.'
],['Yêu cầu','Issue dự kiến','API / kiểm chứng'],[['Đăng nhập / quyền','GS05','login, me; 401 và 403'],['Sản phẩm','GS06–07','products; mã duy nhất, giá nguyên'],['Nhập hàng','GS08','stock, movements; qty > 0'],['Bán hàng','GS11–12','orders; transaction, idempotency'],['Hủy đơn','GS13','orders/:id/cancel; hoàn kho một lần'],['Thống kê','GS14','stats; loại đơn cancelled'],['Kiểm thử / bàn giao','GS16–20','test, UAT, backup và hồ sơ']])
page('Chương 4 — Ước lượng và lịch trình',[
'Ước lượng trong backlog là sơ bộ, chưa phải kết quả Planning Poker của năm sinh viên. Khi nhóm họp cần thảo luận độ phức tạp, phụ thuộc, độ bất định và thống nhất điểm theo cùng một thang. Story Points không phải giờ công.',
'Chuỗi phụ thuộc dưới đây dùng đơn vị tuần và lịch tương đối để PM có thể đổi sang ngày thật sau. Đây là mô hình kế hoạch, không phải lịch sử dự án. Các nhánh giao diện, CI và tài liệu có thể song song nếu đủ người và không chặn nhau.',
'Với mạng nối tiếp A-B-C-D-E-F và thời lượng 1+1+2+2+1+1, tổng là tám tuần. Trong mô hình chỉ có chuỗi này, các nút có float bằng 0. Cần đưa đầy đủ các nhánh và lịch nguồn lực vào trước khi phê duyệt CPM thực tế; không suy ra cả nhóm chắc chắn hoàn thành trong tám tuần.',
'Chưa có hạn nộp được cung cấp. Các mốc học phần tuần 6/11/13/14/15 được giữ trong Charter, không tự gán ngày hoặc hồi tố lịch sử.'
],['Nút','Đầu ra','Thời lượng','ES → EF'],[['A','Khảo sát / Charter','1 tuần','0 → 1'],['B','Kiến trúc / WBS','1 tuần','1 → 2'],['C','Sản phẩm / nhập kho','2 tuần','2 → 4'],['D','Bán hàng / hủy','2 tuần','4 → 6'],['E','QA / UAT / deploy','1 tuần','6 → 7'],['F','Bàn giao','1 tuần','7 → 8']])
page('Chương 4 — Theo dõi Sprint và chỉ số',[
'GitHub đã có 20 Issue và năm Milestone: Charter và WBS, Sprint 1, Sprint 2, UAT và bàn giao, Evidence và bảo vệ. PM, Technical Lead, Backend và Frontend đã có assignee theo tài khoản xác nhận; QA Hoangtrong-S1 đã được xác nhận quyền write.',
'Chủ repo đã tạo Project công khai tại github.com/users/TanTai08/projects/1, có Board/Table và20 Issue. Kế hoạch đã được người dùng áp dụng bằng GitHub CLI:10 Issue Sprint1/38 điểm đề xuất,6 Issue Sprint2/31 điểm và4 Issue Sprint3/16 điểm. Các trạng thái có thể được nhóm cập nhật; xem JSON timestamp thật trong docs/project_snapshots để kiểm tra tại từng thời điểm. Kế hoạch không thay lịch sử cả học kỳ.',
'Burndown cần khối lượng scope và khối lượng còn lại theo thời gian thực tế. Khi có thay đổi scope phải dẫn CR và giải thích bước nhảy trong biểu đồ. Không vẽ số liệu giảm đều để minh họa rồi dùng như evidence.',
'Velocity là tổng Story Points của công việc đạt DoD trong một Sprint. PR throughput là số PR hoàn thành trong khoảng đo. Chưa có hai Sprint thực nên báo cáo chưa có các giá trị này. Workbook có sheet ghi dữ liệu Burndown nhưng không điền số mô phỏng.'
],['Chỉ số','Cách lấy','Hiện trạng'],[['Velocity','Tổng SP đạt DoD / Sprint','Chưa có dữ liệu Sprint'],['Burndown','Snapshot remaining points mỗi ngày','Mẫu trống'],['PR throughput','PR đã merge theo kỳ','Chờ review/merge'],['Defect trend','Lỗi mở/đóng theo thời gian','Chưa có bug log UI/UAT'],['CI','Run cụ thể theo commit','Có run bản khởi tạo pass']])
page('Chương 5 — Kiến trúc và mô hình dữ liệu',[
'Hệ thống dùng Node.js 24 với các module tiêu chuẩn: node:http xử lý yêu cầu, node:sqlite lưu dữ liệu, node:crypto xử lý mật khẩu và session token. Frontend HTML/CSS/JavaScript gọi API cùng origin, không chứa khóa dịch vụ ngoài.',
'SQLite bật foreign_keys và WAL. Các thay đổi tồn kho quan trọng chạy trong BEGIN IMMEDIATE, commit khi mọi bước thành công và rollback nếu lỗi. Thiết kế này phù hợp ứng dụng nhỏ chạy một máy chủ, chưa phù hợp tự động mở nhiều instance dùng cùng file trên các ổ tách biệt.',
'Bảng products giữ số tồn hiện tại; movements giữ các biến động để đối chiếu; orders/items ghi lịch sử bán. checkout_requests liên kết người tạo, idempotency key, payload và đơn đã tạo nhằm trả lại cùng đơn khi retry.',
'Không lưu mật khẩu dạng rõ; users giữ salt và hash scrypt. Bản0.4 dùng hash bất đồng bộ và kiểm lại hash hiện tại trước khi phát hành session hoặc cập nhật mật khẩu. Sessions chứa token ngẫu nhiên và hạn dùng. Database là dữ liệu vận hành, được loại khỏi Git và gói source; khi triển khai phải có volume và bản sao lưu.'
],['Bảng','Vai trò / quan hệ'],[['users / sessions','Danh tính, quyền, token có thời hạn'],['products','SKU duy nhất, giá VND, tồn không âm'],['orders / items','Trạng thái, tổng tiền, chi tiết snapshot'],['movements','Nhập/bán/hoàn hàng có người thao tác'],['checkout_requests','Chống tạo trùng đơn cho mỗi người/mã']])
page('Chương 5 — Xác thực và an toàn dữ liệu',[
'Đăng nhập kiểm tra username và mật khẩu, tạo token session ngẫu nhiên 32 byte. Cookie có HttpOnly, SameSite=Strict và thời hạn tám giờ. Khi triển khai HTTPS phải đặt COOKIE_SECURE=1 để bật thuộc tính Secure.',
'Server kiểm quyền admin cho thay đổi sản phẩm, nhập kho, tạo/xem tài khoản, thống kê và hủy đơn. Việc ẩn nút ở frontend chỉ giúp trải nghiệm, không phải lớp bảo vệ chính. Test gọi trực tiếp API bằng tài khoản staff để xác minh 403.',
'Đổi mật khẩu yêu cầu mật khẩu hiện tại và mật khẩu mới dài 12–256 ký tự. Sau khi đổi, mọi session của tài khoản bị xóa nên cần đăng nhập lại. Chưa có chức năng khôi phục khi quên mật khẩu hoặc email xác minh.',
'Server giới hạn kích thước body, xác nhận kiểu dữ liệu, dùng prepared statements, kiểm tra Origin cho thao tác ghi và đặt CSP. Rate limit0.4 lưu trong bộ nhớ theo tài khoản,15 lỗi/15 phút, giới hạn số bản ghi và hết hạn; không khóa các tài khoản khác chung IP. Đây là giải pháp cho một instance, chưa phân tán. Đây là giới hạn được ghi nhận, không phải chứng nhận bảo mật.'
],['Kiểm soát','Mục đích'],[['scrypt + salt','Hạn chế lộ mật khẩu rõ khi DB bị đọc'],['HttpOnly / SameSite / Secure','Giảm truy cập cookie và yêu cầu chéo nguồn'],['Prepared statements','Không ghép dữ liệu đầu vào vào SQL'],['Server-side role checks','Chặn thao tác vượt quyền'],['Input validation / CSP','Giảm dữ liệu sai và script ngoài']])
page('Chương 5 — Giao dịch bán hàng và phục hồi',[
'Khi xác nhận bán, frontend giữ Idempotency-Key cho cùng giỏ hàng qua các lần retry. Server buộc có key hợp lệ, tìm bản ghi cũ theo user/key và trả lại order_id nếu payload giống. Nếu key đã dùng với payload khác, server trả 409.',
'Trong giao dịch, server đọc từng sản phẩm còn hoạt động, kiểm tra số lượng nguyên dương, không trùng product_id, đủ stock và tổng tiền an toàn. Bản0.4 kiểm thêm expected_price của từng dòng; nếu giá khác giá hiện tại, trả409 PRICE_CHANGED, không ghi đơn, UI hiển thị giá mới và chờ xác nhận. Sau đó mới tạo đơn, lưu items, trừ stock, ghi movements và lưu idempotency request. Mọi bước cùng commit hoặc rollback.',
'Hủy đơn chỉ chấp nhận trạng thái paid. Các dòng hàng được hoàn kho, ghi movements và đổi trạng thái cancelled trong cùng giao dịch. Yêu cầu hủy lần nữa bị từ chối, tránh cộng tồn hai lần. Giới hạn số tồn khi hoàn kho cũng được kiểm tra.',
'Script backup dùng SQLite online backup để sao chép nhất quán khi WAL đang bật. Test đã mở bản backup ở chế độ read-only, kiểm PRAGMA integrity_check và đối chiếu stock cùng số request. Restore production đầy đủ, downtime và quy trình sao lưu định kỳ cần được xác minh trên nơi triển khai thật.'
],['Tình huống','Kết quả đã kiểm tra'],[['Hai yêu cầu bán 4 khi còn 5','Một đơn thành công, một bị từ chối'],['Retry cùng key / payload','Cùng order_id, tồn chỉ trừ một lần'],['Cùng key, đổi giỏ','409 Conflict'],['Hủy đơn lần hai','400; không hoàn thêm hàng'],['Backup DB đang hoạt động','integrity_check = ok']])
page('Chương 5 — Kiểm thử và CI',[
'Kiểm thử tích hợp chạy server thật với database tạm độc lập và request HTTP. Các tài khoản và hàng tạo trong test được xóa cùng thư mục tạm sau khi chạy. Dữ liệu này chỉ là fixture kiểm thử, không dùng làm bằng chứng người dùng thật.',
'Npm run check kiểm tra cú pháp; npm run lint dùng ESLint và format:check dùng Prettier. Backend/UI đã tách module để review theo vai trò. Npm test kiểm tra luồng xác thực, quyền, nhập/bán/hủy, idempotency, đổi mật khẩu, backup và validation. Bản bàn giao bổ sung kiểm proxy HTTPS và merge gate: 13 kiểm thử ứng dụng Node và 6 kiểm thử công cụ đều đã qua local. qa:verify lưu log/manifest có timestamp và source commit trong data/qa-runs; không thay peer approval.',
'Workflow GitHub Actions chạy Node24 trên PR hoặc push main; các check verify/browser/container của source1b749bb đã SUCCESS. Snapshot15/11 ghi20 Issue:13 In Progress,2 In Review,2 Ready,3 Backlog,0 Done;4 reviewer được yêu cầu nhưng chưa có approval. Bằng chứng nguồn: docs/pm/EVIDENCE_SNAPSHOT.json. GitHub báo main đã protected; API chưa cho đọc chi tiết required approval/checks nên vẫn cần chủ repo xác nhận trên giao diện.',
'Đã chạy QA trình duyệt tự động trên GitHub Actions: 8/8 case Chromium pass, gồm login sai, admin bán/hủy, staff, mobile, đổi mật khẩu, xác nhận giá và reset giỏ khi session mất hiệu lực. Run: https://github.com/TanTai08/WebSouvenir/actions/runs/43728024281. Kết quả này không thay UAT hoặc mọi kiểm tra khả dụng; cần đánh giá thêm bàn phím, mất mạng và người dùng thật.'
],['Nhóm test','Kết quả / phạm vi'],[['Authentication / role','Test API đã qua'],['Inventory / cancellation','Test API đã qua'],['Idempotency / validation','Test API đã qua'],['Password / backup integrity','Test API đã qua'],['Browser Chromium','8/8 case pass trên CI'],['Docker','Build và thay container giữ volume đã qua'],['UAT / tải production','Chưa thực hiện']])
page('Chương 6 — Rủi ro và thay đổi',[
'Rủi ro được quản lý theo ba bước Identify, Analyze, Respond & Monitor; thang Probability/Impact 1–5 là đề xuất cần đối chiếu quy định môn. Initial register ghi các nguy cơ cụ thể, còn Week06 và Week11 được giữ trống đến khi có cập nhật thật.',
'Biến cố quyền repo đã có diễn biến thực: kiểm tra ban đầu READ, sau đó được ADMIN và đã push nhánh/PR. Tuy nhiên quyền integration với Projects và branch protection vẫn bị giới hạn. Đây là sự kiện kỹ thuật có bằng chứng, chưa tự động thay thế CR thay đổi phạm vi do stakeholder phê duyệt.',
'Rủi ro tạo trùng đơn khi retry đã được xử lý bằng idempotency và có test. Rủi ro mất dữ liệu trên disk tạm vẫn cần phương án hosting lưu bền; chưa có production. Thiếu người nghiệm thu và thiếu dữ liệu Sprint chưa thể đóng bằng việc sinh tài liệu.',
'Mẫu CR có mô tả yêu cầu, lý do, phân tích phạm vi/thời gian/chi phí/rủi ro, phương án, CCB, quyết định và kiểm chứng sau thay đổi. CR-001 ghi nhận yêu cầu thật ưu tiên hosting miễn phí ngày15/11: đã phân tích và chuẩn bị Codespaces, còn chờ nhóm/stakeholder duyệt giới hạn. Không xem như Week11 đã hoàn tất.'
],['Rủi ro','Phản ứng / hiện trạng'],[['Quyền ghi repo','Đã được cấp; còn giới hạn Projects/protection'],['Đơn lặp khi retry','Đã bổ sung key và kiểm thử'],['Mất SQLite trên ổ tạm','Chưa deploy; cần volume hoặc đổi DB'],['Chưa có stakeholder','Để trống; PM bổ sung sau'],['Thiếu UAT thật','Browser CI đã qua; UAT chưa tổ chức']])
page('Chương 7 — Bàn giao, nghiệm thu và vận hành',[
'Bộ bàn giao có source, hướng dẫn, test, Docker/hosting, backup và hồ sơ PDF/DOCX/XLSX/PPTX. Bộ PM bổ sung scope/AC, khảo sát, WBS20 gói, agenda Review/Retro, Sprint2 đề xuất, evidence index và kịch bản bảo vệ; các hoạt động chưa diễn ra được ghi rõ. Các tài liệu nằm trong reports và docs trên nhánh feat/giftshop-initial; chưa gộp main vì cần review.',
'Ứng dụng cần Node 24 và lưu trữ bền. ADMIN_PASSWORD dùng để khởi tạo lần đầu, không phải công cụ tự đổi mật khẩu khi database đã tồn tại. Demo0.4 bỏ qua seed trên database có sẵn, nên đổi mật khẩu không làm restart thất bại. COOKIE_SECURE=1 được dùng sau HTTPS; DB_PATH phải trỏ vào volume. Cấu hình Render có thể có phí và chưa được đăng ký. Có thêm cấu hình Codespaces để demo HTTPS trong hạn mức tài khoản; chưa tạo Codespace/link thực tế. Xem phụ lục 06 và docs/FREE_HTTPS_DEMO.md.',
'UAT cần người nghiệm thu thật chạy kịch bản nhập hàng → bán → kiểm tồn → hủy → đối chiếu doanh thu, cùng kiểm quyền và phục hồi. Đã chuẩn bị 15 case chi tiết tại docs/UAT_PLAN.csv và biên bản UAT_SIGNOFF_DRAFT. Mỗi case ghi dữ liệu đầu vào, kết quả mong đợi, kết quả thực tế, pass/fail và bằng chứng. Hiện chưa có chữ ký hoặc email xác nhận.',
'Bảo vệ có 6 phút trình bày, 5 phút demo và 5 phút Q&A theo tài liệu môn. Slide đã có bản 10 trang để cập nhật dữ liệu thật. Cần dữ liệu demo có nhãn, bản local/video dự phòng và diễn tập với đủ vai trò trước bảo vệ.'
],['Người bàn giao','Nội dung cần trình bày'],[['PM','Phạm vi, kế hoạch, thay đổi và bằng chứng'],['Tech Lead','Kiến trúc, CI, deploy, backup'],['Backend','Transaction, quyền, idempotency'],['Frontend','Luồng sử dụng và xử lý lỗi'],['QA','Test, defect, DoD và UAT']])
page('Chương 7 — Kết luận hiện trạng và việc cần xác nhận',[
'Bản 0.4.0 đã hoàn thiện thêm các phần kỹ thuật có thể kiểm tra độc lập và chuẩn bị đủ vị trí cho nhóm năm người. Việc thêm username được tách khỏi mã ứng dụng, giúp gán nhiệm vụ sau mà không viết lại phần mềm.',
'Điều chưa hoàn thành là các điều kiện cần dữ liệu và hoạt động thực: thông tin đầy đủ của các thành viên, thông tin học phần, người nghiệm thu, lịch sử hai Sprint, review của thành viên, UAT, HTTPS và chữ ký. Theo yêu cầu PM, các trường này được để trống để cập nhật sau.',
'Báo cáo hiện trạng không tuyên bố vượt Authenticity Gate. Bản nộp cuối kỳ cần thay các mục pending bằng kết quả có nguồn, được nhóm và stakeholder xác nhận. Không tạo release v1.0.0 trước nghiệm thu hoặc coi repo mới tạo là lịch sử cả học kỳ.',
'Bài học kỹ thuật đã rút ra từ phiên phát triển: cần phân biệt quyền repo với quyền integration; xử lý retry ngoài việc disable nút; dùng backup hiểu WAL; phân biệt test tự động với kiểm thử chấp nhận người dùng. Bài học phối hợp nhóm chỉ được ghi sau khi nhóm thực hành thật.'
],['Checklist cuối kỳ','Trạng thái'],[['5 vị trí / thông tin cá nhân','Có vai trò; còn chờ dữ liệu'],['Mã nguồn / test / CI','Có bản triển khai và kiểm tra'],['Charter / WBS / Risk / slide','Có tài liệu; chưa duyệt'],['Sprint history / CR / UAT','Chưa có bằng chứng thật'],['HTTPS / release / sign-off','Chưa hoàn thành'],['Drive','Có thư mục đích đã được PM chấp thuận']])
assert len(pages)==15
story=[];doc=Document();doc.sections[0].header.paragraphs[0].text='GIFTSHOP / WEBSOUVENIR — BÁO CÁO HIỆN TRẠNG, CHƯA NGHIỆM THU'
for n,(title,paras,heads,rows) in enumerate(pages):
 if n:story.append(PageBreak());doc.add_page_break()
 story.extend([Paragraph(escape(title),styles['Heading1']),Spacer(1,12)]);doc.add_heading(title,1)
 for para in paras:story.extend([Paragraph(escape(para),styles['Normal']),Spacer(1,9)]);doc.add_paragraph(para)
 if heads:
  cells=[[Paragraph(escape(str(v)),styles['Normal']) for v in r] for r in [heads]+rows]
  table=Table(cells,colWidths=[(507)/len(heads)]*len(heads),repeatRows=1,hAlign='LEFT');table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E7F0E8')),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#CCD9CE')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.append(table)
  dt=doc.add_table(rows=1,cols=len(heads));dt.style='Table Grid'
  for i,v in enumerate(heads):dt.rows[0].cells[i].text=v
  for r in rows:
   for c,v in zip(dt.add_row().cells,r):c.text=str(v)
def footer(c,d):
 c.setFont('VN',8);c.drawString(44,26,'GiftShop 0.4.0 · Hiện trạng kỹ thuật · Không thay thế nghiệm thu');c.drawRightString(550,26,str(d.page))
SimpleDocTemplate(str(out/'04_Technical_Report_CURRENT.pdf'),leftMargin=44,rightMargin=44,topMargin=38,bottomMargin=45).build(story,onFirstPage=footer,onLaterPages=footer)
doc.save(out/'04_Technical_Report_CURRENT.docx')
print('Created 04_Technical_Report_CURRENT.pdf + docx')
