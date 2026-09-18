# REVIEW V4 PROMPT

Không code. Audit current repo và lập bảng Requirement / Current / File / Gap / Severity / Proposed change.

Bắt buộc kiểm tra:
1. số RoadSegment hiện có
2. coverage theo corridor/district
3. adjacency/topology
4. start/end node
5. split tại intersection
6. one-way
7. road class
8. travel time metadata
9. forecast depth theo hour
10. unknown state
11. confidence/data coverage
12. search có dùng cho origin/destination được không
13. snapping có chưa
14. routing engine/library/service hiện có không
15. external routing có join lại được flood segment không
16. vehicle passability hiện có không
17. motorbike/car hiện khác nhau ra sao
18. route alternatives UI/mobile có chưa

Sau audit phải kết luận coverage hiện tại đủ hay chưa. Không fake route nếu coverage chưa đủ.
