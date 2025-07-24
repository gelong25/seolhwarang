// import-courses.js
const admin = require('firebase-admin');
const courses = require('../data/courses.json');

admin.initializeApp({
  credential: admin.credential.cert(require('../../serviceAccountKey.json'))
});

const db = admin.firestore();
(async () => {
  const batch = db.batch();
  const colRef = db.collection('courses');  // 원하는 컬렉션명
  courses.forEach(course => {
    // id를 doc ID로 쓰고 싶다면:
    const docRef = colRef.doc(course.id.toString());
    batch.set(docRef, course);
  });
  await batch.commit();
  console.log('업로드 완료!');
  process.exit(0);
})();