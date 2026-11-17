// TODO: 현재 관리자 인증이 없다. 배포 전에 반드시 여기서 인증을 검사할 것.
// 모든 /admin 쿼리와 서버 액션이 이 함수를 거치므로, 이곳만 구현하면 된다.
export async function assertAdmin(): Promise<void> {}
