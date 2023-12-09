// cronJob.js
import cron from "cron";
import fetch from "node-fetch";

// الوظيفة التي تنفذ الاتصال بالـ API
export async function fetchDataAndPrint(apiEndpoint) {
  try {
    // قم بالاتصال بالـ API هنا باستخدام fetch واستخدم الطريقة GET
    const response = await fetch(apiEndpoint, {
      method: "GET",
    });
    const data = await response.json();

    // اطبع الرد إذا كنت تريد
    console.log("request done");
  } catch (error) {
    // يمكنك التعامل مع الأخطاء هنا
    console.error("حدث خطأ في الاتصال بالـ API:", error.message);
  }
}
export const startjob = () => {
  // جدولة المهمة لتنفيذ الوظيفة كل 5 دقائق
  const job = new cron.CronJob("9 * * * * *", () => {
    fetchDataAndPrint("https://onlineshopping-bxt6.onrender.com/");
  });
  job.start();
};
