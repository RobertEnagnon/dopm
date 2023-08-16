const moment = require('moment'); // require
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getParetoDiagram = async (serviceId, year) => {
    /* Set data to return */
    let paretoData = {};

    /* Set date for complete year */
    const startDate = new Date(`${year}-01-01T00:00:00`);
    const endDate = new Date(`${year}-12-31T23:59:59`);

    let where = {
        date: {
            gte: startDate,
            lte: endDate
        }
    }

    if(serviceId !== 0) {
        where.serviceId = serviceId
    }

    /* Get all audits */
    const audits = await prisma.at_audit
    .findMany({
        orderBy: [{ createdAt: "asc" }],
        include: {
            service: true,
            Evaluations: {
                select: {
                    check: true,
                    checkpoint: {
                        select: {
                            id: true,
                            standard: true
                        }
                    }
                }
            }
        },
        where: where
    })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval.checkpoint?.standard && (eval.check === '0' || eval.check === 'false') ) {
                if( eval.checkpoint.standard in paretoData ) {
                    paretoData[eval.checkpoint.standard]++;
                } else {
                    paretoData[eval.checkpoint.standard] = 1;
                }
            }
        })
    })

    /* Sort data */
    let paretoSorted = [];
    for( let checkpoint in paretoData ) {
        paretoSorted.push({checkpoint: checkpoint, value: paretoData[checkpoint]});
    }
    paretoSorted = paretoSorted.sort((a, b) => {
        return b.value - a.value;
    });

    return paretoSorted.slice(0, 10);
}

exports.getNokByMonth = async (date) => {
    /* Set data to return */
    let data = {};

    /* Set date for complete month */
    const startDate = moment(date).startOf('month').toDate();
    const endDate = moment(date).endOf('month').toDate();

    /* Get all audits */
    const audits = await prisma.at_audit
    .findMany({
        orderBy: [{ createdAt: "asc" }],
        include: {
            Evaluations: {
                select: {
                    check: true,
                    checkpoint: {
                        select: {
                            id: true,
                            standard: true
                        }
                    }
                }
            }
        },
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval.checkpoint != null && (eval.check === '0' || eval.check === 'false') ) {
                if( eval.checkpoint.standard in data ) {
                    data[eval.checkpoint.standard]++;
                } else {
                    data[eval.checkpoint.standard] = 1;
                }
            }
        })
    })

    /* Sort data */
    let sortedData = [];
    for( let checkpoint in data ) {
        sortedData.push({ checkpoint: checkpoint, value: data[checkpoint]});
    }
    sortedData = sortedData.sort((a, b) => {
        return b.value - a.value;
    });

    return sortedData;
}
exports.getNokByYear = async (date) => {
    /* Set data to return */
    let data = {};

    /* Set date for complete month */
    const startDate = moment(date).startOf('year').toDate();
    const endDate = moment(date).endOf('year').toDate();

    /* Get all audits */
    const audits = await prisma.at_audit
    .findMany({
        orderBy: [{ createdAt: "asc" }],
        include: {
            Evaluations: {
                select: {
                    check: true,
                    checkpoint: {
                        select: {
                            id: true,
                            standard: true
                        }
                    }
                }
            }
        },
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval.checkpoint != null && (eval.check === '0' || eval.check === 'false') ) {
                if( eval.checkpoint.standard in data ) {
                    data[eval.checkpoint.standard]++;
                } else {
                    data[eval.checkpoint.standard] = 1;
                }
            }
        })
    })

    /* Sort data */
    let sortedData = [];
    for( let checkpoint in data ) {
        sortedData.push({ checkpoint: checkpoint, value: data[checkpoint]});
    }
    sortedData = sortedData.sort((a, b) => {
        return b.value - a.value;
    });

    return sortedData;
}

exports.getNokByZone = async (serviceId, date) => {
    /* Set data to return */
    let data = {};

    /* Set date for complete month */
    const startDate = moment(date).startOf('month').toDate();
    const endDate = moment(date).endOf('month').toDate();

    let where = {
        date: {
            gte: startDate,
            lte: endDate
        }
    }

    if(serviceId !== 0) {
        where.serviceId = serviceId
    }

    /* Get all audits */
    const audits = await prisma.at_audit
      .findMany({
          orderBy: [{ createdAt: "asc" }],
          include: {
              Evaluations: {
                  select: {
                      check: true,
                      checkpoint: {
                          select: {
                              id: true,
                              standard: true,
                              zone: true
                          }
                      }
                  }
              }
          },
          where: where
      })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval?.checkpoint?.zone?.name && (eval.check === '0' || eval.check === 'false') ) {
                if( eval.checkpoint.zone.name in data ) {
                    data[eval.checkpoint.zone.name]++;
                } else {
                    data[eval.checkpoint.zone.name] = 1;
                }
            }
        })
    })

    /* Sort data */
    let sortedData = [];
    for( let checkpoint in data ) {
        sortedData.push({ checkpoint: checkpoint, value: data[checkpoint]});
    }
    sortedData = sortedData.sort((a, b) => {
        return b.value - a.value;
    });

    return sortedData;
}

exports.getAnnuelByZone = async (date) => {
    /* Set data to return */
    let data = {};

    /* Set date for complete month */
    const startDate = moment(date).startOf('year').toDate();
    const endDate = moment(date).endOf('year').toDate();

    /* Get all audits */
    const audits = await prisma.at_audit
      .findMany({
          orderBy: [{ createdAt: "asc" }],
          include: {
              Evaluations: {
                  select: {
                      check: true,
                      checkpoint: {
                          select: {
                              id: true,
                              standard: true,
                              zone: true
                          }
                      }
                  }
              }
          },
          where: {
              date: {
                  gte: startDate,
                  lte: endDate
              }
          }
      })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval?.checkpoint?.zone?.name && (eval.check === '1' || eval.check === 'true') ) {
                if( eval.checkpoint.zone.name in data ) {
                    data[eval.checkpoint.zone.name]++;
                } else {
                    data[eval.checkpoint.zone.name] = 1;
                }
            }
        })
    })

    /* Sort data */
    let sortedData = [];
    for( let checkpoint in data ) {
        sortedData.push({ checkpoint: checkpoint, value: data[checkpoint]});
    }
    sortedData = sortedData.sort((a, b) => {
        return b.value - a.value;
    });

    return sortedData;
}

exports.getAnnuelByStatus = async (serviceId, date) => {
    /* Set data to return */
    let data = {};

    /* Set date for complete month */
    const startDate = moment(date).startOf('year').toDate();
    const endDate = moment(date).endOf('year').toDate();

    let where = {
        date: {
            gte: startDate,
            lte: endDate
        }
    }

    if(serviceId !== 0) {
        where.serviceId = serviceId
    }

    /* Get all audits */
    const audits = await prisma.at_audit
      .findMany({
          orderBy: [{ createdAt: "asc" }],
          include: {
              Evaluations: {
                  select: {
                      check: true,
                      checkpoint: {
                          select: {
                              id: true,
                              standard: true,
                              zoneId: true
                          }
                      }
                  }
              }
          },
          where: where
      })

    /* Get data for checkpoints */
    audits.forEach(audit => {
        audit.Evaluations.forEach(eval => {
            if( eval.checkpoint != null && (eval.check === '1' || eval.check === 'true')) {
                if( eval.checkpoint.standard in data ) {
                    let nb = Number(data[eval.checkpoint.standard][0]);
                    data[eval.checkpoint.standard][0] = nb + 1;
                } else {
                    data[eval.checkpoint.standard] = [1, 0];
                }
            } else if( eval.checkpoint != null && (eval.check === '0' || eval.check === 'false') ) {
                if( eval.checkpoint.standard in data ) {
                    let nb = Number(data[eval.checkpoint.standard][1]);
                    data[eval.checkpoint.standard][1] = nb + 1;
                } else {
                    data[eval.checkpoint.standard] = [0, 1];
                }
            }
        })
    })

    /* Sort data */
    let sortedData = [];
    for( let checkpoint in data ) {
        const ok = data[checkpoint][0] || 0;
        const nok = data[checkpoint][1] || 0;

        const txc = Math.round((ok / (ok+nok)) * 100);

        sortedData.push({
            checkpoint: checkpoint,
            ok,
            nok,
            txc,
        });
    }

    return sortedData;
}
