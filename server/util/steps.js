function getSteps(currentStatus, status) {
  let steps = {
    currentStatus: "",
    step1: {
      status: "success",
      title: "已上架",
    },
    step2: {
      status: "process",
      title: "已下单，等待买家付款",
    },
    step3: {
      status: "wait",
      title: "已付款，等待卖家发货",
    },
    step4: {
      status: "wait",
      title: "已发货，等待买家收货",
    },
    step5: {
      status: "wait",
      title: "交易完成",
    },
  };
  steps.currentStatus = currentStatus;
  if (currentStatus === 1) {
    if (status === "已上架") {
      return steps;
    } else {
      steps.step1.status = "error";
      steps.step1.title = status;
      steps.step2.status = "wait";
      return steps;
    }
  } else if (currentStatus === 2) {
    if (status === "已下单，等待买家付款") {
      steps.step2.status = "success";
      steps.step3.status = "wait";
      return steps;
    } else {
      steps.step2.status = "error";
      steps.step2.title = status;
      return steps;
    }
  } else if (currentStatus === 3) {
    if (status === "已付款，等待卖家发货") {
      steps.step2.status = "success";
      steps.step3.status = "success";
      steps.step4.status = "wait";
      return steps;
    } else {
      steps.step2.status = "success";
      steps.step3.status = "error";
      steps.step3.title = status;
      return steps;
    }
  } else if (currentStatus === 4) {
    if (status === "已发货，等待买家收货") {
      steps.step2.status = "success";
      steps.step3.status = "success";
      steps.step4.status = "success";
      steps.step5.status = "wait";
      return steps;
    } else {
      steps.step2.status = "success";
      steps.step3.status = "success";
      steps.step4.status = "error";
      steps.step4.title = status;
      return steps;
    }
  } else if (currentStatus === 5 && status === "交易完成") {
    steps.step2.status = "success";
    steps.step3.status = "success";
    steps.step4.status = "success";
    steps.step5.status = "success";
    return steps;
  }
}
module.exports = getSteps;
