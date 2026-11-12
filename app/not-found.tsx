import Link from 'next/link';
import { Actions } from '../components/Common';

export default function NotFound() {
  return (
    <main>
      <section className="top top-page">
        <div className="wrap">
          <h1>페이지를 찾을 수 없습니다</h1>
          <h2 className="page-sub">주소가 바뀌었거나 아직 열리지 않은 페이지입니다</h2>
          <p className="lead"><Link href="/area/">출장 지역 목록</Link>에서 찾아보시거나 전화 주세요.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
