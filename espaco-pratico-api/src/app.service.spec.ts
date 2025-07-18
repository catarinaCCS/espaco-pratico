import { AppService } from "./app.service";

describe("AppService", () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it("should return status ok from getHealth", () => {
    expect(service.getHealth()).toEqual({ status: "ok" });
  });
});
