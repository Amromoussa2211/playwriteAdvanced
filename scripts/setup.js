/**
 * سكريبت التثبيت التلقائي للتبعيات
 * يقوم بالتحقق من التبعيات وتثبيتها تلقائياً
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 بدء إعداد بيئة الاختبار الآلي...\n');

// التحقق من Node.js
function checkNode() {
  console.log('📌 التحقق من Node.js...');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js مثبت: ${nodeVersion}`);
    return true;
  } catch (error) {
    console.error('❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً من: https://nodejs.org/');
    return false;
  }
}

// التحقق من npm
function checkNpm() {
  console.log('📌 التحقق من npm...');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm مثبت: ${npmVersion}`);
    return true;
  } catch (error) {
    console.error('❌ npm غير مثبت');
    return false;
  }
}

// تثبيت التبعيات
function installDependencies() {
  console.log('\n📦 تثبيت تبعيات Node.js...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ تم تثبيت التبعيات بنجاح');
    return true;
  } catch (error) {
    console.error('❌ فشل تثبيت التبعيات');
    return false;
  }
}

// تثبيت متصفحات Playwright
function installPlaywrightBrowsers() {
  console.log('\n🎭 تثبيت متصفحات Playwright...');
  try {
    execSync('npx playwright install --with-deps', { stdio: 'inherit' });
    console.log('✅ تم تثبيت متصفحات Playwright بنجاح');
    return true;
  } catch (error) {
    console.error('⚠️  فشل تثبيت متصفحات Playwright (يمكن تخطي هذا للمحمول فقط)');
    return false;
  }
}

// تثبيت تعريفات Appium
function installAppiumDrivers() {
  console.log('\n📱 تثبيت تعريفات Appium...');
  try {
    execSync('npx appium driver install uiautomator2', { stdio: 'inherit' });
    console.log('✅ تم تثبيت UiAutomator2 driver');
    
    // محاولة تثبيت XCUITest (لـ iOS)
    try {
      execSync('npx appium driver install xcuitest', { stdio: 'inherit' });
      console.log('✅ تم تثبيت XCUITest driver');
    } catch (error) {
      console.log('⚠️  تخطي XCUITest driver (يتطلب macOS)');
    }
    
    return true;
  } catch (error) {
    console.error('⚠️  فشل تثبيت تعريفات Appium (يمكن تخطي هذا للويب فقط)');
    return false;
  }
}

// إنشاء ملف .env من .env.example
function createEnvFile() {
  console.log('\n⚙️  التحقق من ملف .env...');
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ تم إنشاء ملف .env من .env.example');
      console.log('⚠️  يرجى تحديث البيانات في ملف .env قبل التشغيل');
    } else {
      console.log('⚠️  لم يتم العثور على .env.example');
    }
  } else {
    console.log('✅ ملف .env موجود بالفعل');
  }
}

// إنشاء المجلدات المطلوبة
function createDirectories() {
  console.log('\n📁 إنشاء المجلدات المطلوبة...');
  const dirs = [
    'reports',
    'test-results',
    'playwright-report'
  ];
  
  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ تم إنشاء مجلد: ${dir}`);
    }
  });
}

// التحقق من Docker (اختياري)
function checkDocker() {
  console.log('\n🐳 التحقق من Docker (اختياري)...');
  try {
    const dockerVersion = execSync('docker --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Docker مثبت: ${dockerVersion}`);
    
    try {
      const dockerComposeVersion = execSync('docker-compose --version', { encoding: 'utf8' }).trim();
      console.log(`✅ Docker Compose مثبت: ${dockerComposeVersion}`);
    } catch {
      console.log('⚠️  Docker Compose غير مثبت (اختياري)');
    }
    
    return true;
  } catch (error) {
    console.log('⚠️  Docker غير مثبت (اختياري - يمكن التشغيل بدونه)');
    return false;
  }
}

// التشغيل الرئيسي
async function main() {
  let hasErrors = false;

  // التحقق من المتطلبات الأساسية
  if (!checkNode() || !checkNpm()) {
    console.error('\n❌ المتطلبات الأساسية غير مستوفاة. يرجى تثبيت Node.js و npm أولاً.');
    process.exit(1);
  }

  // تثبيت التبعيات
  if (!installDependencies()) {
    hasErrors = true;
  }

  // إنشاء ملف .env
  createEnvFile();

  // إنشاء المجلدات
  createDirectories();

  // تثبيت متصفحات Playwright
  console.log('\n');
  const answer = 'y'; // يمكن استبدالها بـ readline للسؤال
  if (answer.toLowerCase() === 'y') {
    installPlaywrightBrowsers();
  }

  // تثبيت تعريفات Appium
  console.log('\n');
  const answerAppium = 'y'; // يمكن استبدالها بـ readline للسؤال
  if (answerAppium.toLowerCase() === 'y') {
    installAppiumDrivers();
  }

  // التحقق من Docker
  checkDocker();

  // النتيجة النهائية
  console.log('\n' + '='.repeat(60));
  if (hasErrors) {
    console.log('⚠️  اكتمل الإعداد مع بعض التحذيرات');
  } else {
    console.log('✅ اكتمل الإعداد بنجاح!');
  }
  console.log('='.repeat(60));
  
  console.log('\n📝 الخطوات التالية:');
  console.log('1. قم بتحديث البيانات في ملف .env');
  console.log('2. لتشغيل اختبارات الويب: npm run test:web');
  console.log('3. لتشغيل اختبارات المحمول: npm run test:mobile');
  console.log('4. لتشغيل جميع الاختبارات: npm run test:all');
  console.log('5. لتشغيل باستخدام Docker: npm run docker:test');
  console.log('\n📚 للمزيد من المعلومات، راجع ملف README.md\n');
}

// تشغيل السكريبت
main().catch(error => {
  console.error('❌ خطأ حرج:', error);
  process.exit(1);
});
