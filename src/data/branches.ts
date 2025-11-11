export interface Branch {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  region: string;
  address: string;
  phone: string;
  agentCount: number;
}

export const branches: Branch[] = [
  // 北海道営業部
  { id: 'br-001', code: 'BR001', name: '帯広支社', departmentId: 'dept-01', region: '北海道', address: '北海道帯広市西一条南10-18', phone: '0155-22-7211', agentCount: 12 },
  { id: 'br-002', code: 'BR002', name: '旭川支社', departmentId: 'dept-01', region: '北海道', address: '北海道旭川市宮下通7-3897-12　旭川第一生命ビル7階', phone: '0166-26-0101', agentCount: 15 },
  { id: 'br-003', code: 'BR003', name: '札幌総合支社', departmentId: 'dept-01', region: '北海道', address: '北海道札幌市中央区北三条西1丁目1-11　サンメモリアビル4階', phone: '011-241-3141', agentCount: 25 },
  { id: 'br-004', code: 'BR004', name: '道央支社', departmentId: 'dept-01', region: '北海道', address: '北海道札幌市厚別区厚別中央二条5-3-31　新札幌第一生命ビル5階', phone: '011-895-7500', agentCount: 18 },
  { id: 'br-005', code: 'BR005', name: '苫小牧営業支社', departmentId: 'dept-01', region: '北海道', address: '北海道苫小牧市表町5-4-7　苫小牧海晃第一ビルディング5階', phone: '0144-34-4647', agentCount: 10 },
  { id: 'br-006', code: 'BR006', name: '函館支社', departmentId: 'dept-01', region: '北海道', address: '北海道函館市本町6-7　函館第一ビルディング7階', phone: '0138-55-1131', agentCount: 13 },
  
  // 東北営業部
  { id: 'br-007', code: 'BR007', name: '青森支社', departmentId: 'dept-02', region: '青森県', address: '青森県青森市中央1-22-8　青森第一生命ビル7階', phone: '017-734-3191', agentCount: 11 },
  { id: 'br-008', code: 'BR008', name: '盛岡支社', departmentId: 'dept-02', region: '岩手県', address: '岩手県盛岡市中央通3-1-2　盛岡第一生命ビル7階', phone: '019-653-1266', agentCount: 14 },
  { id: 'br-009', code: 'BR009', name: '仙台総合支社', departmentId: 'dept-02', region: '宮城県', address: '宮城県仙台市青葉区国分町3-1-1　仙台第一生命ビル5階', phone: '022-227-2521', agentCount: 22 },
  { id: 'br-010', code: 'BR010', name: '秋田支社', departmentId: 'dept-02', region: '秋田県', address: '秋田県秋田市大町2-4-44　秋田第一ビル7階', phone: '018-865-1111', agentCount: 10 },
  { id: 'br-011', code: 'BR011', name: '山形支社', departmentId: 'dept-02', region: '山形県', address: '山形県山形市十日町1-1-34　山形駅前通ビル', phone: '023-631-5711', agentCount: 12 },
  { id: 'br-012', code: 'BR012', name: '福島支社', departmentId: 'dept-02', region: '福島県', address: '福島県郡山市虎丸町2-11　郡山虎丸町第一生命ビルディング4階', phone: '024-922-7190', agentCount: 15 },
  
  // 関信越営業部
  { id: 'br-013', code: 'BR013', name: '水戸支社', departmentId: 'dept-03', region: '茨城県', address: '茨城県水戸市泉町1-2-4　水戸泉町第一生命ビル9階', phone: '029-226-9511', agentCount: 13 },
  { id: 'br-014', code: 'BR014', name: '栃木支社', departmentId: 'dept-03', region: '栃木県', address: '栃木県宇都宮市泉町1-29　第一生命ビル2階', phone: '028-621-1400', agentCount: 14 },
  { id: 'br-015', code: 'BR015', name: '群馬支社', departmentId: 'dept-03', region: '群馬県', address: '群馬県前橋市表町2-2-6　前橋ファーストビルディング3階', phone: '027-224-6227', agentCount: 12 },
  { id: 'br-016', code: 'BR016', name: '太田支社', departmentId: 'dept-03', region: '群馬県', address: '群馬県太田市飯田町878　太田第一生命館2階', phone: '0276-45-0211', agentCount: 9 },
  { id: 'br-017', code: 'BR017', name: '新潟支社', departmentId: 'dept-03', region: '新潟県', address: '新潟県新潟市中央区東万代町1-30　新潟第一生命ビル5階', phone: '025-290-5192', agentCount: 16 },
  { id: 'br-018', code: 'BR018', name: '長岡支社', departmentId: 'dept-03', region: '新潟県', address: '新潟県長岡市城内町1-2-3　長岡第一生命ビル4階', phone: '0258-39-5310', agentCount: 11 },
  { id: 'br-019', code: 'BR019', name: '甲府支社', departmentId: 'dept-03', region: '山梨県', address: '山梨県甲府市丸の内2-30-2　甲府第一生命ビル7階', phone: '055-228-5121', agentCount: 10 },
  { id: 'br-020', code: 'BR020', name: '長野支社', departmentId: 'dept-03', region: '長野県', address: '長野県長野市中御所219-1　長野第一生命ビル', phone: '026-227-2111', agentCount: 14 },
  { id: 'br-021', code: 'BR021', name: '松本支社', departmentId: 'dept-03', region: '長野県', address: '長野県松本市深志2-5-26　松本第一ビル6階', phone: '0263-35-1212', agentCount: 11 },
  
  // 首都圏第一営業部
  { id: 'br-022', code: 'BR022', name: 'さいたま総合支社', departmentId: 'dept-04', region: '埼玉県', address: '埼玉県さいたま市大宮区宮町4-122　大宮第一生命小峯ビル3階', phone: '048-643-0412', agentCount: 24 },
  { id: 'br-023', code: 'BR023', name: '熊谷支社', departmentId: 'dept-04', region: '埼玉県', address: '埼玉県熊谷市本町2-48　熊谷第一生命ビル2階', phone: '048-524-7341', agentCount: 12 },
  { id: 'br-024', code: 'BR024', name: '川越支社', departmentId: 'dept-04', region: '埼玉県', address: '埼玉県川越市脇田本町13-5　川越第一生命ビル7階', phone: '049-246-0521', agentCount: 15 },
  { id: 'br-025', code: 'BR025', name: '埼玉東部支社', departmentId: 'dept-04', region: '埼玉県', address: '埼玉県越谷市南越谷1-16-12　新越谷第一生命ビルディング6階', phone: '048-988-5181', agentCount: 13 },
  { id: 'br-026', code: 'BR026', name: '所沢支社', departmentId: 'dept-04', region: '埼玉県', address: '埼玉県所沢市日吉町15-14　所沢第一生命ビル6階', phone: '04-2924-8118', agentCount: 11 },
  
  // 首都圏第二営業部
  { id: 'br-027', code: 'BR027', name: '千葉総合支社', departmentId: 'dept-05', region: '千葉県', address: '千葉県千葉市中央区中央3-3-1　フジモト第一生命ビル4階', phone: '043-224-3741', agentCount: 20 },
  { id: 'br-028', code: 'BR028', name: '成田支社', departmentId: 'dept-05', region: '千葉県', address: '千葉県成田市花崎町801-1　成田ＴＴビル2階', phone: '0476-22-1043', agentCount: 10 },
  { id: 'br-029', code: 'BR029', name: '船橋支社', departmentId: 'dept-05', region: '千葉県', address: '千葉県船橋市本町2-8-6　船橋第一生命ビル', phone: '047-433-5511', agentCount: 16 },
  { id: 'br-030', code: 'BR030', name: '柏常総支社', departmentId: 'dept-05', region: '千葉県', address: '千葉県柏市末広町7-3　柏第一生命ビル5階', phone: '04-7144-0136', agentCount: 14 },
  { id: 'br-031', code: 'BR031', name: '土浦営業支社', departmentId: 'dept-05', region: '茨城県', address: '茨城県土浦市小松1-3-33　ハトリビル5階', phone: '029-824-0001', agentCount: 9 },
  { id: 'br-032', code: 'BR032', name: '上野総合支社', departmentId: 'dept-05', region: '東京都', address: '東京都台東区上野1-10-12　商工中金・第一生命上野ビル7階', phone: '03-3831-1281', agentCount: 18 },
  { id: 'br-033', code: 'BR033', name: '池袋総合支社', departmentId: 'dept-05', region: '東京都', address: '東京都豊島区南池袋2-30-11　池袋第一生命ビルディング8階', phone: '03-3987-3311', agentCount: 22 },
  
  // 首都圏第三営業部
  { id: 'br-034', code: 'BR034', name: '渋谷総合支社', departmentId: 'dept-06', region: '東京都', address: '東京都渋谷区渋谷3-8-12　渋谷第一生命ビル9階', phone: '03-3498-3321', agentCount: 26 },
  { id: 'br-035', code: 'BR035', name: '新宿総合支社', departmentId: 'dept-06', region: '東京都', address: '東京都新宿区西新宿1-24-1　エステック情報ビル26階', phone: '03-3342-0251', agentCount: 28 },
  { id: 'br-036', code: 'BR036', name: '立川支社', departmentId: 'dept-06', region: '東京都', address: '東京都立川市柴崎町2-3-6　立川第一生命ビル5階', phone: '042-523-2521', agentCount: 15 },
  { id: 'br-037', code: 'BR037', name: '八王子支社', departmentId: 'dept-06', region: '東京都', address: '東京都八王子市明神町3-20-6　八王子ファーストスクエア5階', phone: '042-646-5181', agentCount: 14 },
  { id: 'br-038', code: 'BR038', name: '都心総合支社', departmentId: 'dept-06', region: '東京都', address: '東京都中央区京橋3-7-1　相互館110タワー7階', phone: '03-5159-4170', agentCount: 30 },
  { id: 'br-039', code: 'BR039', name: '江東営業支社', departmentId: 'dept-06', region: '東京都', address: '東京都墨田区江東橋2-19-7　富士ソフトビル6階', phone: '03-5159-4170', agentCount: 16 },
  { id: 'br-040', code: 'BR040', name: '横浜総合支社', departmentId: 'dept-06', region: '神奈川県', address: '神奈川県横浜市神奈川区金港町6-6　横浜みなと第一生命ビル3階', phone: '045-451-7000', agentCount: 27 },
  { id: 'br-041', code: 'BR041', name: '神奈川東部支社', departmentId: 'dept-06', region: '神奈川県', address: '神奈川県川崎市幸区堀川町580-16　川崎テックセンター4階', phone: '044-540-6520', agentCount: 19 },
  { id: 'br-042', code: 'BR042', name: '町田支社', departmentId: 'dept-06', region: '東京都', address: '東京都町田市森野2-30-14　町田第一生命館1階', phone: '042-726-3711', agentCount: 12 },
  { id: 'br-043', code: 'BR043', name: '厚木支社', departmentId: 'dept-06', region: '神奈川県', address: '神奈川県厚木市旭町1-24-13　第一伊藤ビル3階', phone: '046-229-8811', agentCount: 11 },
  { id: 'br-044', code: 'BR044', name: '湘南支社', departmentId: 'dept-06', region: '神奈川県', address: '神奈川県藤沢市藤沢109-6　湘南ＮＤビル9階', phone: '0466-25-1000', agentCount: 14 },
  
  // 東海営業部
  { id: 'br-045', code: 'BR045', name: '沼津支社', departmentId: 'dept-07', region: '静岡県', address: '静岡県沼津市大手町2-4-1　沼津第一生命ビル4階', phone: '055-963-2511', agentCount: 11 },
  { id: 'br-046', code: 'BR046', name: '静岡支社', departmentId: 'dept-07', region: '静岡県', address: '静岡県静岡市葵区日出町2-1　田中産商・第一生命共同ビル3階', phone: '054-254-3331', agentCount: 15 },
  { id: 'br-047', code: 'BR047', name: '浜松支社', departmentId: 'dept-07', region: '静岡県', address: '静岡県浜松市中区板屋町111-2　浜松アクトタワー16階', phone: '053-454-2331', agentCount: 16 },
  { id: 'br-048', code: 'BR048', name: '名古屋総合支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県名古屋市中区錦3-4-6　桜通大津第一生命ビル5階', phone: '052-962-8221', agentCount: 28 },
  { id: 'br-049', code: 'BR049', name: '名古屋西営業支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県名古屋市中区新栄町2-13　栄第一生命ビルディング2階', phone: '052-957-2736', agentCount: 18 },
  { id: 'br-050', code: 'BR050', name: '中京総合支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県名古屋市中区金山1-12-14　金山総合ビル10階', phone: '052-322-1161', agentCount: 22 },
  { id: 'br-051', code: 'BR051', name: '名古屋東支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県名古屋市東区矢田1-3-33　名古屋大曽根第一生命ビル6階', phone: '052-712-0871', agentCount: 17 },
  { id: 'br-052', code: 'BR052', name: '岡崎支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県岡崎市唐沢町11-5　第一生命・三井住友海上岡崎ビル6階', phone: '0564-22-5511', agentCount: 13 },
  { id: 'br-053', code: 'BR053', name: '豊橋営業支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県豊橋市広小路3-45-2　豊橋第一生命ビル4階', phone: '0532-55-8001', agentCount: 11 },
  { id: 'br-054', code: 'BR054', name: '豊田支社', departmentId: 'dept-07', region: '愛知県', address: '愛知県豊田市喜多町1-140　ギャザ7階', phone: '0565-32-2325', agentCount: 14 },
  
  // 北陸営業部
  { id: 'br-055', code: 'BR055', name: '富山支社', departmentId: 'dept-08', region: '富山県', address: '富山県富山市安住町7-14　富山安住町第一生命ビル6階', phone: '076-432-6181', agentCount: 12 },
  { id: 'br-056', code: 'BR056', name: '金沢支社', departmentId: 'dept-08', region: '石川県', address: '石川県金沢市昭和町16-1　ヴィサージュ10階', phone: '076-231-2291', agentCount: 14 },
  { id: 'br-057', code: 'BR057', name: '福井支社', departmentId: 'dept-08', region: '福井県', address: '福井県福井市大手3-12-20　冨田第一生命ビル4階', phone: '0776-22-5630', agentCount: 10 },
  
  // 関西営業部
  { id: 'br-058', code: 'BR058', name: '滋賀支社', departmentId: 'dept-09', region: '滋賀県', address: '滋賀県大津市中央3-1-8　大津第一生命ビルディング5階', phone: '077-522-2644', agentCount: 11 },
  { id: 'br-059', code: 'BR059', name: '京都総合支社', departmentId: 'dept-09', region: '京都府', address: '京都府京都市中京区御池通東洞院西入ル笹屋町435　京都御池第一生命ビル9階', phone: '075-221-7951', agentCount: 20 },
  { id: 'br-060', code: 'BR060', name: '奈良支社', departmentId: 'dept-09', region: '奈良県', address: '奈良県奈良市角振町18　奈良第一生命ビル', phone: '0742-26-2821', agentCount: 12 },
  { id: 'br-061', code: 'BR061', name: '和歌山支社', departmentId: 'dept-09', region: '和歌山県', address: '和歌山県和歌山市六番丁5　和歌山第一生命ビル7階', phone: '073-423-1261', agentCount: 10 },
  { id: 'br-062', code: 'BR062', name: '神戸総合支社', departmentId: 'dept-09', region: '兵庫県', address: '兵庫県神戸市中央区京町69番地　三宮第一生命ビル4階', phone: '078-332-6551', agentCount: 22 },
  { id: 'br-063', code: 'BR063', name: '姫路支社', departmentId: 'dept-09', region: '兵庫県', address: '兵庫県姫路市白銀町24番地　みなと銀行・第一生命共同ビルディング7階', phone: '079-222-1733', agentCount: 13 },
  { id: 'br-064', code: 'BR064', name: '堺支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府堺市堺区中之町西1-1-3　堺第一生命館', phone: '072-221-7031', agentCount: 15 },
  { id: 'br-065', code: 'BR065', name: '大阪東支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府大阪市中央区大手前1-4-12　大阪天満橋ビルディング9階', phone: '06-6944-7654', agentCount: 20 },
  { id: 'br-066', code: 'BR066', name: '大阪南支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府大阪市中央区難波2-2-3　御堂筋グランドビル5階', phone: '06-6214-6210', agentCount: 18 },
  { id: 'br-067', code: 'BR067', name: '大阪北支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府大阪市北区中崎西2-4-12　梅田センタービル7階', phone: '06-6374-3722', agentCount: 19 },
  { id: 'br-068', code: 'BR068', name: '茨木支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府茨木市双葉町13-19　第一生命ビル', phone: '072-633-7741', agentCount: 12 },
  { id: 'br-069', code: 'BR069', name: '布施支社', departmentId: 'dept-09', region: '大阪府', address: '大阪府東大阪市長堂3-8-4', phone: '06-6783-1391', agentCount: 11 },
  { id: 'br-070', code: 'BR070', name: '岐阜支社', departmentId: 'dept-09', region: '岐阜県', address: '岐阜県岐阜市金宝町1-3　岐阜第一生命ビル5階', phone: '058-263-7151', agentCount: 13 },
  { id: 'br-071', code: 'BR071', name: '三重支社', departmentId: 'dept-09', region: '三重県', address: '三重県津市栄町2-312　津第一生命ビル1階', phone: '059-227-1234', agentCount: 14 },
  
  // 中国営業部
  { id: 'br-072', code: 'BR072', name: '鳥取支社', departmentId: 'dept-10', region: '鳥取県', address: '鳥取県鳥取市扇町115-1　鳥取駅前第一生命ビル5階', phone: '0857-23-7151', agentCount: 9 },
  { id: 'br-073', code: 'BR073', name: '島根支社', departmentId: 'dept-10', region: '島根県', address: '島根県松江市朝日町498　松江駅前第一生命ビル6階', phone: '0852-26-2200', agentCount: 10 },
  { id: 'br-074', code: 'BR074', name: '岡山支社', departmentId: 'dept-10', region: '岡山県', address: '岡山県岡山市北区駅前町2-1-1　ＪＲ岡山駅第1ＮＫビル', phone: '086-225-4141', agentCount: 16 },
  { id: 'br-075', code: 'BR075', name: '広島総合支社', departmentId: 'dept-10', region: '広島県', address: '広島県広島市南区的場町1-2-21　広島第一生命ＯＳビル10階', phone: '082-262-0271', agentCount: 24 },
  { id: 'br-076', code: 'BR076', name: '福山営業支社', departmentId: 'dept-10', region: '広島県', address: '広島県福山市紅葉町2-36　福山ＤＳビル8階', phone: '084-924-5211', agentCount: 12 },
  { id: 'br-077', code: 'BR077', name: '山口支社', departmentId: 'dept-10', region: '山口県', address: '山口県下関市細江町1-2-10　6階', phone: '083-223-0311', agentCount: 11 },
  
  // 四国営業部
  { id: 'br-078', code: 'BR078', name: '東四国支社', departmentId: 'dept-11', region: '香川県', address: '香川県高松市寿町2-1-1　高松第一生命ビル新館9階', phone: '087-851-0101', agentCount: 15 },
  { id: 'br-079', code: 'BR079', name: '徳島営業支社', departmentId: 'dept-11', region: '徳島県', address: '徳島県徳島市新町橋2-10-1　徳島眉山第一生命ビル6階', phone: '088-622-3034', agentCount: 10 },
  { id: 'br-080', code: 'BR080', name: '松山支社', departmentId: 'dept-11', region: '愛媛県', address: '愛媛県松山市二番町3-5-5　松山二番町第一生命ビル5階', phone: '089-941-0147', agentCount: 14 },
  { id: 'br-081', code: 'BR081', name: '高知支社', departmentId: 'dept-11', region: '高知県', address: '高知県高知市南はりまや町1-2-2', phone: '088-823-2555', agentCount: 11 },
  
  // 九州営業部
  { id: 'br-082', code: 'BR082', name: '北九州総合支社', departmentId: 'dept-12', region: '福岡県', address: '福岡県北九州市小倉北区米町2-1-2　小倉第一生命ビル7階', phone: '093-541-3281', agentCount: 18 },
  { id: 'br-083', code: 'BR083', name: '北九州西営業支社', departmentId: 'dept-12', region: '福岡県', address: '福岡県北九州市八幡西区黒崎3-9-22　ＲＩＳＯ黒崎駅前ビル2階', phone: '050-3781-8090', agentCount: 12 },
  { id: 'br-084', code: 'BR084', name: '福岡総合支社', departmentId: 'dept-12', region: '福岡県', address: '福岡県福岡市博多区冷泉町5-35　福岡祇園第一生命ビル11階', phone: '092-291-8631', agentCount: 26 },
  { id: 'br-085', code: 'BR085', name: '久留米支社', departmentId: 'dept-12', region: '福岡県', address: '福岡県久留米市六ツ門町15-1　久留米第一生命ビル1階', phone: '0942-39-7111', agentCount: 13 },
  { id: 'br-086', code: 'BR086', name: '佐賀支社', departmentId: 'dept-12', region: '佐賀県', address: '佐賀県佐賀市水ヶ江1-2-28　佐賀第一生命ビルディング1階', phone: '0952-22-2161', agentCount: 10 },
  { id: 'br-087', code: 'BR087', name: '長崎支社', departmentId: 'dept-12', region: '長崎県', address: '長崎県長崎市西坂町2-3　第一生命ビル4階', phone: '095-823-8111', agentCount: 14 },
  { id: 'br-088', code: 'BR088', name: '佐世保営業支社', departmentId: 'dept-12', region: '長崎県', address: '長崎県佐世保市常盤町1-3', phone: '0956-23-5311', agentCount: 9 },
  { id: 'br-089', code: 'BR089', name: '熊本支社', departmentId: 'dept-12', region: '熊本県', address: '熊本県熊本市中央区新市街11-18　熊本第一生命ビルディング5階', phone: '096-325-6311', agentCount: 17 },
  { id: 'br-090', code: 'BR090', name: '大分支社', departmentId: 'dept-12', region: '大分県', address: '大分県大分市中央町1-1-5　大分第一生命ビル5階', phone: '097-534-0241', agentCount: 12 },
  { id: 'br-091', code: 'BR091', name: '宮崎支社', departmentId: 'dept-12', region: '宮崎県', address: '宮崎県宮崎市広島1-18-13　宮崎第一生命ビルディング新館８階', phone: '0985-28-3111', agentCount: 11 },
  { id: 'br-092', code: 'BR092', name: '鹿児島支社', departmentId: 'dept-12', region: '鹿児島県', address: '鹿児島県鹿児島市西千石町1-1　西千石第一生命ビル6階', phone: '099-224-8200', agentCount: 15 },
  { id: 'br-093', code: 'BR093', name: '那覇支社', departmentId: 'dept-12', region: '沖縄県', address: '沖縄県那覇市久茂地2-22-10　那覇第一生命ビル6階', phone: '098-867-7333', agentCount: 13 },
  
  // 法人営業部第一本部
  { id: 'br-094', code: 'BR094', name: '法人営業第一支社', departmentId: 'dept-13', region: '東京都', address: '東京都千代田区有楽町1-13-1　第一生命ビル', phone: '03-3000-0001', agentCount: 20 },
  { id: 'br-095', code: 'BR095', name: '法人営業第二支社', departmentId: 'dept-13', region: '東京都', address: '東京都千代田区有楽町1-13-1　第一生命ビル', phone: '03-3000-0002', agentCount: 18 },
  { id: 'br-096', code: 'BR096', name: '法人営業第三支社', departmentId: 'dept-13', region: '大阪府', address: '大阪府大阪市中央区城見1-4-70　住友生命ビル', phone: '06-6000-0001', agentCount: 16 },
  
  // 法人営業部第二本部
  { id: 'br-097', code: 'BR097', name: '法人営業第四支社', departmentId: 'dept-14', region: '東京都', address: '東京都千代田区有楽町1-13-1　第一生命ビル', phone: '03-3000-0003', agentCount: 19 },
  { id: 'br-098', code: 'BR098', name: '法人営業第五支社', departmentId: 'dept-14', region: '愛知県', address: '愛知県名古屋市中区錦3-6-29　第一生命ビル', phone: '052-0000-0001', agentCount: 17 },
  { id: 'br-099', code: 'BR099', name: '法人営業第六支社', departmentId: 'dept-14', region: '福岡県', address: '福岡県福岡市中央区天神1-4-1　第一生命ビル', phone: '092-0000-0001', agentCount: 15 },
  
  // 金融法人営業局
  { id: 'br-100', code: 'BR100', name: '金融法人第一支社', departmentId: 'dept-15', region: '東京都', address: '東京都千代田区有楽町1-13-1　第一生命ビル', phone: '03-3000-0004', agentCount: 22 },
  { id: 'br-101', code: 'BR101', name: '金融法人第二支社', departmentId: 'dept-15', region: '大阪府', address: '大阪府大阪市中央区城見1-4-70　第一生命ビル', phone: '06-6000-0002', agentCount: 20 }
];

export const getBranchById = (id: string): Branch | undefined => {
  return branches.find(branch => branch.id === id);
};

export const getBranchesByDepartmentId = (departmentId: string): Branch[] => {
  return branches.filter(branch => branch.departmentId === departmentId);
};
