# PRM Flutter – Ôn thi bằng video
- Nguồn đề: Drive "Prm ôn thi" (5 folder, 248 ảnh) -> OCR -> gộp trùng còn 158 câu (content/bank.json).
- Đáp án: lấy theo dòng "Đáp án" trong ảnh đề (SP26_Final, SU26_B5, SU26_Final); câu còn lại tự đối chiếu docs.flutter.dev.
- Bài giảng: content/n1..n4.json -> `node scripts/compose.mjs` -> public/lessons/*.json + src/data/questions.json
- Giọng đọc: `python3 scripts/tts.py` (edge-tts, vi-VN-NamMinhNeural) -> public/audio/*.mp3; thời lượng từng câu đo bằng mutagen nên phụ đề khớp tuyệt đối.
- Tiến độ lưu localStorage key prm-progress-v1 (thuộc/sai/đánh dấu/đã xem/flashcard/lịch sử thi).
