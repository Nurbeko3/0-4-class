// «shortcuts» modulining matnlari. src/i18n/strings.ts ga avtomatik qo'shiladi (spread).
// `say.` bilan boshlanadigan kalitlar — ovozli yo'riqnoma. uz va ru kalitlari bir xil bo'lishi shart.
export const keysStrings = {
  uz: {
    'topic.keys': 'Tezkor tugmalar',
    'keys.copy.title': 'Nusxa ko’paytir',
    'keys.cut.title': 'Uyiga ko’chir',
    'keys.undo.title': 'Ortga qaytar',
    'keys.save.title': 'Belgila va saqla',

    'say.keys.copy': 'Bo’sh joylarni to’ldiramiz! Ctrl tugmasini bosib turib, C ni bos — nusxa olinadi.',
    'say.keys.copy.paste': 'Endi Ctrl ni bosib turib V ni bos — har bosishda bitta nusxa qo’yiladi.',
    'say.keys.cut': 'Kimdir adashib, begona uyga kirib qoldi! Uni sichqoncha bilan bos.',
    'say.keys.cut.x': 'Ctrl ni bosib turib X ni bos — u qirqib olinadi.',
    'say.keys.cut.place': 'Endi uning o’z uyini sichqoncha bilan bos.',
    'say.keys.cut.v': 'Ctrl ni bosib turib V ni bos — u uyiga qo’yiladi.',
    'say.keys.undo': 'Shumtak siyoh rasmni bulg’adi! Ctrl ni bosib turib Z ni bos — oxirgi dog’ yo’qoladi.',
    'say.keys.save': 'Ctrl ni bosib turib A ni bos — hammasi birdan belgilanadi.',
    'say.keys.save.copy': 'Barakalla! Endi Ctrl va C bilan nusxa ol.',
    'say.keys.save.paste': 'Ctrl va V ni bos — hammasi ko’payadi.',
    'say.keys.save.disk': 'Rasm tayyor! Ctrl va S ni bos — rasm saqlanadi.',
    'say.keys.hold': 'Ctrl tugmasini qo’yib yubormay turib, ikkinchi tugmani bos.',

    'keys.clip': 'Xotira',
    'keys.saved': 'Saqlandi!',

    'lesson.keys.goal': 'Bola klaviaturadagi tezkor tugmalarni biladi: Ctrl+C — nusxa olish, Ctrl+V — qo’yish, Ctrl+X — qirqib olish, Ctrl+Z — ortga qaytarish, Ctrl+A — hammasini belgilash, Ctrl+S — saqlash.',
    'lesson.keys.explain': 'Klaviaturadan Ctrl tugmasini topib ko’rsating: u pastki chap burchakda. Qoidani tushuntiring: Ctrl yolg’iz hech narsa qilmaydi — uni chap qo’l bilan bosib turib, ikkinchi tugma bir marta bosiladi. Proyektorda bitta so’zni Ctrl+C va Ctrl+V bilan ko’paytirib, Ctrl+Z bilan ortga qaytarib ko’rsating.',
    'lesson.keys.practice': '3-sinf: «Nusxa ko’paytir» (Ctrl+C, keyin bir necha marta Ctrl+V), «Uyiga ko’chir» (narsani bosish, Ctrl+X, uyini bosish, Ctrl+V) va «Ortga qaytar» (Ctrl+Z bilan dog’larni bittalab olib tashlash). 4-sinfda «Belgila va saqla» qo’shiladi: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S ketma-ket. Ekrandagi tugmalar kerakli harfni sariq rangda ko’rsatadi (4-sinfda — faqat adashgandan keyin).',
    'lesson.keys.tip': 'Eng ko’p uchraydigan xato — Ctrl ni qo’yib yuborib, keyin harfni bosish; o’yin buni o’zi eslatadi. Klaviatura rus tilida bo’lsa ham tugmalar ishlaydi: harf emas, tugmaning joyi muhim. Sensorli ekranda ekrandagi Ctrl ni, keyin harfni bosish mumkin.',
  },
  ru: {
    'topic.keys': 'Горячие клавиши',
    'keys.copy.title': 'Размножь',
    'keys.cut.title': 'Перенеси домой',
    'keys.undo.title': 'Отмени',
    'keys.save.title': 'Выдели и сохрани',

    'say.keys.copy': 'Заполним пустые места! Удерживая клавишу Ctrl, нажми C — получится копия.',
    'say.keys.copy.paste': 'Теперь, удерживая Ctrl, нажимай V — каждый раз вставляется одна копия.',
    'say.keys.cut': 'Кто-то заблудился и попал в чужой домик! Нажми на него мышкой.',
    'say.keys.cut.x': 'Удерживая Ctrl, нажми X — он вырежется.',
    'say.keys.cut.place': 'Теперь нажми мышкой на его собственный домик.',
    'say.keys.cut.v': 'Удерживая Ctrl, нажми V — он вставится в свой домик.',
    'say.keys.undo': 'Озорные чернила испачкали рисунок! Удерживая Ctrl, нажми Z — последнее пятно исчезнет.',
    'say.keys.save': 'Удерживая Ctrl, нажми A — всё выделится сразу.',
    'say.keys.save.copy': 'Молодец! Теперь скопируй: Ctrl и C.',
    'say.keys.save.paste': 'Нажми Ctrl и V — всего станет больше.',
    'say.keys.save.disk': 'Рисунок готов! Нажми Ctrl и S — рисунок сохранится.',
    'say.keys.hold': 'Не отпуская Ctrl, нажми вторую клавишу.',

    'keys.clip': 'Буфер',
    'keys.saved': 'Сохранено!',

    'lesson.keys.goal': 'Ребёнок знает горячие клавиши: Ctrl+C — копировать, Ctrl+V — вставить, Ctrl+X — вырезать, Ctrl+Z — отменить, Ctrl+A — выделить всё, Ctrl+S — сохранить.',
    'lesson.keys.explain': 'Найдите и покажите на клавиатуре клавишу Ctrl: она в левом нижнем углу. Объясните правило: сама по себе Ctrl ничего не делает — её удерживают левой рукой и один раз нажимают вторую клавишу. На проекторе размножьте одно слово через Ctrl+C и Ctrl+V и отмените действие через Ctrl+Z.',
    'lesson.keys.practice': '3 класс: «Размножь» (Ctrl+C, затем несколько раз Ctrl+V), «Перенеси домой» (нажать на предмет, Ctrl+X, нажать на его домик, Ctrl+V) и «Отмени» (убрать пятна по одному через Ctrl+Z). В 4 классе добавляется «Выдели и сохрани»: подряд Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+S. Клавиши на экране подсвечивают нужную букву жёлтым (в 4 классе — только после ошибки).',
    'lesson.keys.tip': 'Самая частая ошибка — отпустить Ctrl и только потом нажать букву; игра сама об этом напоминает. Клавиши работают и при русской раскладке: важно место клавиши, а не буква. На сенсорном экране можно нажать Ctrl на экране, а затем букву.',
  },
} as const
