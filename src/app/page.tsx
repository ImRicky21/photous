import CameraComponent from "@/components/camera";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="m-4">
          <h1 className="text-xl italic">
            Wellcome to{" "}
            <span className="text-slate-400 font-semibold text-4xl ">
              &rdquo;PhotoUs&rdquo;
            </span>
          </h1>
          <p className="italic text-slate-400">
            {" "}
            &rdquo;you and me in one photo&rdquo;
          </p>
        </div>
        <div className="p-10">
          <CameraComponent />
        </div>
      </main>
    </div>
  );
}
