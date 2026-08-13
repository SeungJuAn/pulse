import {
  Entity,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

/**
 * 서비스 사용자. M1에서 회원가입/로그인의 대상이 된다.
 * (notificationPreference 등은 M4 알림 단계에서 추가 예정)
 */
@Entity()
export class User {
  [OptionalProps]?: "createdAt";
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  // 비밀번호 해시. 응답에 절대 실리지 않도록 hidden, 필요할 때만 lazy 로드.
  @Property({ hidden: true, lazy: true })
  password!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}
// 감시조건
@Entity()
export class Watch {
  [OptionalProps]?: "active" | "createdAt";
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property({ comment: "심볼" })
  symbol: string;

  @Property({ comment: "소스" })
  source: string;

  @Property({ comment: "조건" })
  operator: "<=" | ">=";

  @Property()
  threshold!: number; // 기준 가격

  @Property()
  active: boolean = true;

  @Property()
  createdAt: Date = new Date();
}

@Entity()
export class Quote {
  [OptionalProps]?: "collectedAt";
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ comment: "종목" })
  symbol: string;

  @Property({ comment: "출처" })
  source: string;

  @Property({ comment: "가격" })
  price: number;

  @Property({ comment: "수집 시각", onCreate: () => new Date() })
  collectedAt: Date = new Date();
}

// MikroORM에 등록할 엔티티 목록. 새 엔티티는 여기에 추가.
export const entities = [User, Watch, Quote];
