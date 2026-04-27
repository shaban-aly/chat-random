import { Metadata } from "next";
import { ChevronRight, Shield, Globe, Lock, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "عن التطبيق وسياسة الخصوصية | Random Chat",
  description: "تعرف على كيفية عمل تطبيق Random Chat، سياسة الخصوصية، وشروط الاستخدام. نحن نهتم بأمانك وخصوصيتك.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-12 max-w-4xl mx-auto screen-enter">
      <header className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          العودة للرئيسية
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">عن Random Chat</h1>
        <p className="text-xl text-muted-foreground">الخصوصية، الأمان، والتواصل الحر.</p>
      </header>

      <div className="space-y-16">
        {/* How it works */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Globe size={28} />
            </div>
            <h2 className="text-2xl font-black">ما هو Random Chat؟</h2>
          </div>
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
            <p>
              Random Chat هو منصة تواصل اجتماعي تتيح لك التحدث مع أشخاص من جميع أنحاء العالم أو من بلدك تحديداً عبر غرف الدردشة الجغرافية. 
              هدفنا هو توفير بيئة آمنة وحرة للتعارف والنقاش دون الحاجة لإنشاء حساب أو تقديم بيانات شخصية.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 mt-8">
              <li className="bg-card p-6 rounded-3xl border border-border">
                <h3 className="text-foreground font-bold mb-2">دردشة عشوائية</h3>
                <p className="text-sm">مطابقة فورية مع شخص مجهول لبدء محادثة خاصة.</p>
              </li>
              <li className="bg-card p-6 rounded-3xl border border-border">
                <h3 className="text-foreground font-bold mb-2">غرف جغرافية</h3>
                <p className="text-sm">انضم لغرفة بلدك وشارك في الدردشة الجماعية.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Privacy Policy */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black">سياسة الخصوصية</h2>
          </div>
          <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">لا نجمع بياناتك</h3>
              <p className="text-muted-foreground">التطبيق لا يطلب رقم هاتفك، بريدك الإلكتروني، أو اسمك الحقيقي. أنت تدخل كـ &quot;ضيف&quot; بهوية مجهولة تماماً.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">تشفير الرسائل</h3>
              <p className="text-muted-foreground">تتم المحادثات بشكل مباشر ولا يتم تخزينها في خوادمنا بعد انتهاء الجلسة أو إغلاق المحادثة العشوائية.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">ملفات تعريف الارتباط (Cookies)</h3>
              <p className="text-muted-foreground">نستخدم التخزين المحلي (LocalStorage) فقط لحفظ تفضيلاتك (مثل الوضع الليلي أو قائمة الأشخاص الذين حظرتهم) لضمان تجربة أفضل لك.</p>
            </div>
          </div>
        </section>

        {/* Terms of Use */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-destructive/10 text-destructive rounded-2xl">
              <Shield size={28} />
            </div>
            <h2 className="text-2xl font-black">شروط الاستخدام</h2>
          </div>
          <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
            <p>لضمان بقاء التطبيق مكاناً آمناً للجميع، يرجى الالتزام بالقواعد التالية:</p>
            <div className="grid gap-4 mt-6">
              {[
                "يمنع منعاً باتاً نشر محتوى إباحي أو غير أخلاقي.",
                "يمنع خطاب الكراهية، التنمر، أو التهديد.",
                "يمنع انتحال شخصيات الآخرين أو ممارسة النصب.",
                "يمنع تداول البيانات الشخصية الحساسة (أرقام الهواتف، العناوين) في الغرف العامة.",
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-muted/30 p-4 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm italic">
              * ملاحظة: الإخلال بهذه الشروط قد يؤدي إلى حظر جهازك من استخدام التطبيق بشكل نهائي بناءً على بلاغات المستخدمين.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-primary/5 p-12 rounded-[3rem] border border-primary/10">
          <MessageSquare size={48} className="mx-auto text-primary mb-6" />
          <h2 className="text-2xl font-black mb-4">هل لديك استفسار؟</h2>
          <p className="text-muted-foreground mb-8">نحن نعمل دائماً على تحسين تجربتك. تواصل معنا عبر البريد الإلكتروني.</p>
          <a 
            href="mailto:support@randomchat.pro" 
            className="inline-flex h-14 items-center justify-center px-10 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95"
          >
            تواصل معنا
          </a>
        </section>
      </div>

      <footer className="mt-20 py-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Random Chat Pro. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
