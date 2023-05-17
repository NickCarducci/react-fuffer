import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  doc,
  endBefore,
  //getFirestore,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter
} from "firebase/firestore";

//const refresh = "";

const postIdToSubdocument = (dropId, keepalive, firestore) => {
  //hydratePost (banned on Medium.com vianickcarducci.medium.com, 5/2021)
  if (!dropId.startsWith("")) return null;
  const id = dropId.replace(/^[a-zA-Z]/g, "");
  const coll = dropId.substring(0, dropId.indexOf(id));
  //return { id, collection };
  const free = Jail(
    //for each: foo = {...doc.data(),doc.id}
    doc(firestore, coll, id),
    keepalive,
    null, //sort for firestore orderBy { order: "time", by: "desc" }
    null, //near for geofirestore { center: near.center, radius: near.distance }
    //sort && near => cannot be true (coexist, orderBy used by geohashing)
    14, //limit
    null, //startAfter
    null //endBefore
  );
  //Jail always returns an array, handle as such (here, single ".doc(")
  const document = free.docs[0]; //product
  if (document.exists) {
    var foo = document.data();
    foo.collection = coll;
    foo.id = id;
    foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
    return foo;
  }
};
//prevent reconciliation loss?
//has the meidas brothers thought to super pac eachother?
//no one match me can you be unique with a super pac

//How can you remain unique with a Super PAC buddy?
//50% deficit isn't an accident

//we talking entrapment?
//all unemployment is marginal (on a platter)
//$30k in back rub appointments (duct/reward)

export const matchy = (snapshotQuery, near) => {
  //const dele = snapshotQuery._delegate ? snapshotQuery : snapshotQuery._query;
  //console.log(snapshotQuery); //_delegate
  if (!snapshotQuery) return "";
  const sn = near
    ? snapshotQuery._query
    : snapshotQuery[0] && snapshotQuery[0]._query;
  //console.log(sn.path);
  return !sn || !sn.path
    ? ""
    : sn.path.segments.join(",") +
        "/" +
        sn.filters
          .map((x) => (!x.field ? "" : x.field.segments.join("")))
          .join(",") +
        (near
          ? ""
          : snapshotQuery
              .map((x, i) =>
                snapshotQuery[i].type === "where"
                  ? (!snapshotQuery[i].wa
                      ? ""
                      : snapshotQuery[i].wa.segments.join("")) +
                    snapshotQuery[i].ma +
                    snapshotQuery[i].ga
                  : null
              )
              .filter((x) => x)
              .join("/"));
};
const Jail = (
  snapshotQuery,
  keepalive,
  sort,
  near, //sort && near cannot be true (coexist, orderBy used by geohashing)
  lim,
  startAfter,
  endBefore,
  verbose, //REFER TO Readme.md
  firestore
) => {
  keepalive = keepalive ? keepalive : 3600000;
  //no need for async await here in database-jail. React.funcs seem to abstract
  //___(not-Promises) for that async await is unneccesary functions run once,
  //insofarthatso [async/await, Promises] aren't handled
  var jail = useRef(false); //Object.values(functionRefs).length > 0
  //references "this." function
  //if (!near && !snapshotQuery[0]) return console.log(snapshotQuery[0]);
  const match = matchy(snapshotQuery, near);
  console.log("match hook", match);
  const [close, joist] = useState(null); //closeSnapshot, function-in-state
  //to close:()=>{}; in "useState"/updateState, update-state
  //close /*ready*/ &&
  //variables must be defined inside useEffect, if used in it...
  const [docs, updateSet] = useState(null);
  var quer = null;
  if (near) {
    quer = startAfter
      ? snapshotQuery.near(near).startAfter(startAfter).limit(lim)
      : endBefore
      ? snapshotQuery.near(near).endBefore(endBefore).limitToLast(lim)
      : snapshotQuery.near(near).limit(lim);
  } else {
    quer = [
      ...snapshotQuery,
      orderBy(
        ...[
          sort.order ? sort.order : firestore.FieldPath.documentId(),
          sort.by ? sort.by : "desc"
        ]
      ),
      ...(startAfter
        ? [startAfter(startAfter), limit(lim)]
        : endBefore
        ? [endBefore(endBefore), limitToLast(lim)]
        : [limit(lim)])
    ];
  }

  const snap = (qs /*querySnapshot*/) => {
    //only promises resolve, and those don't return synchronously
    //shallow updates? subobjects/"subdocuments"/subdocument
    let p = 0;
    let dol = [];
    (!match.includes(".doc(") ? qs.docs : [qs]).forEach(async (doc) => {
      p++;
      if (doc.exists) {
        var foo = fooize(doc, match, keepalive);
        //subdocuments work as snapshot without promises here! forget data.js hydrateUser
        foo.drop = await postIdToSubdocument(foo.dropId, keepalive, firestore);
        foo.drops = foo.dropIds.map(
          async (f) => await postIdToSubdocument(f, keepalive, firestore)
        );
        foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
        dol.push(foo);
      }
    });
    if (qs.docs.length === p) {
      startAfter = qs.docs[qs.docs.length - 1];
      endBefore = qs.docs[0];
      updateSet(dol);
    }
  };
  const save = near
    ? quer.onSnapshot(snap, standardCatch)
    : onSnapshot(query(...quer), snap, standardCatch);
  joist(save);

  //timeoutRemountFirebaseSnapshot/"keepalive"
  const [reset, resetCancel] = useState(false);
  const Counting = () => {
    const [result, update] = useState(false);
    useEffect(() => {
      jail.seconds && clearInterval(jail.seconds);
      jail.seconds = setInterval(() => update(keepalive - 1000), 1000);
      return () => clearInterval(jail.seconds);
    }, []);
    return result;
  };
  let aliveFor = Counting();
  if (reset) {
    //aliveFor = Counting();
    this(
      snapshotQuery, //1
      keepalive, //2
      sort, //3
      near, //sort && near => cannot be true (coexist, orderBy used by geohashing)
      limit, //5
      startAfter, //6
      endBefore, //7
      verbose //8
    ); //resetCancel(false)
  }
  useEffect(() => {
    verbose && console.log(docs.length + " results");
    //long-polling for react, [as abstracted] as "keepalive" is in python,
    jail.murder && clearTimeout(jail.murder);
    jail.murder = setTimeout((e) => close(), keepalive); //1hr
    return () => clearTimeout(jail.murder);
  }, [close, docs, keepalive, verbose]); //when call this(), reset/resets count until close()

  return {
    docs,
    refresh: useCallback(() => resetCancel(true), []),
    id: match,
    aliveFor,
    startAfter,
    endBefore,
    verbose
  };
};

const arrayMessage = (message) =>
  message
    .toLowerCase()
    //capture or, excluding set, match 2 or more of the preceding token
    .replace(/((\r\n|\r|\n)+[^a-zA-Z]+_+[ ]{2,})+/g, " ")
    .split(" ");
const standardCatch = (err) => console.log("react-fuffer: " + err.message);
const fooize = (doc, match, keepalive) => {
  var foo = doc.data();
  foo.id = doc.id;
  foo.collection = match.split("/")[0];
  foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
  return foo;
};

class WakeSnapshot extends React.Component {
  curmudgeon = (func) => {
    this.props.setJail({
      jailclasses: this.props.jailclasses.filter(
        (y) => func.id !== matchy(y.snapshotQuery)
      ),
      closes: this.props.closes.filter((y) => !y[func.id]),
      alivefors: this.props.alivefors.filter((y) => !y[func.id]),
      updatedclasses: this.props.updatedclasses.filter((u) => u.id !== func.id)
    });
  };
  unmount = (func) => {
    console.log("unmounting", this.props.jailclasses, func);
    this.curmudgeon(func);
    this.props.setJail({
      //deletedclasses is just for remounting without ...traveling
      deletedclasses: [
        ...this.props.deletedclasses,
        { ...func.resnap, id: func.id }
      ],
      freedocs: this.props.freedocs.filter((u) => u.id !== func.id)
    });
  };
  remount = (animal) => {
    this.curmudgeon(animal);
    this.props.remount(
      {
        //not deleted...remounted
        //deletedclasses is just for remounting without ...traveling, await for send
        freedocs: this.props.freedocs.filter((u) => u.id !== animal.id),
        resnaps: this.props.resnaps.filter((u) => u.id !== animal.id)
      },
      animal
    );
  };
  flush = () =>
    this.props.freedocs.forEach((animal) => {
      this.remount(animal);
    });

  render() {
    const { isProfile, openAnyway, freedocs } = this.props;
    const goingSnapshots = freedocs && freedocs.constructor === Array;
    const atLeastOne =
      goingSnapshots &&
      freedocs.find((x) => x.aliveFor > 0 && x.aliveFor < 1200000);
    const open = atLeastOne || openAnyway;
    const stylequick = {
      margin: open ? "0px 20px" : "0px 0px",
      borderRadius: "22px",
      boxShadow: "0px 0px 7px 2px black",
      border: "4px solid rgb(160,200,255)",
      borderBottom: "7px solid rgb(160,200,255)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "30px",
      backgroundColor: "rgb(20,60,120)",
      color: "rgb(220,220,240)"
    };
    return (
      <div
        style={{
          overflow: !open ? "hidden" : "",
          fontSize: open ? "" : "0px",
          height: open ? "min-content" : "0px",
          width: "100%",
          textAlign: "center",
          alignItems: "center",
          flexDirection: "column",
          overflowWrap: "break-word",
          zIndex: "10",
          display: "flex",
          position: isProfile ? "fixed" : "relative",
          transition: ".3s ease-in"
        }}
      >
        are you still there?
        <div
          onClick={this.flush}
          style={{
            fontSize: open ? "" : "0px",
            border: `${open ? 3 : 0}px green solid`,
            borderRadius: open ? "9px" : "0px",
            padding: open ? "4px 10px" : "0px 0px",
            marginTop: open ? "3px" : "0px",
            transition: ".3s ease-in"
          }}
        >
          YES
        </div>
        <br />
        Ongoing Processes
        <br />
        <div
          style={{
            margin: open ? "10px 0px" : "0px 0px",
            width: "calc(100% - 10px)",
            border: "2px solid",
            borderRadius: "10px"
          }}
        >
          {open &&
            freedocs &&
            freedocs.map((func, i) => {
              const thisalivefor = this.props.alivefors.find((y) => y[func.id]);
              const thisclose = this.props.closes.find((y) => y[func.id]);
              return (
                <div
                  key={func.id + i}
                  style={{
                    margin: "10px 0px",
                    alignItems: "center",
                    display: open ? "flex" : "none",
                    opacity:
                      func.aliveFor > 0 && func.aliveFor < 1200000
                        ? func.aliveFor / 2400000
                        : 1
                  }}
                >
                  <span style={{ ...stylequick, padding: "0px 5px" }}>
                    {func.id}&nbsp;-&nbsp;
                    {thisalivefor && Object.values(thisalivefor)}
                  </span>
                  <div
                    style={{ ...stylequick, width: "30px" }}
                    onClick={() => this.remount(func)}
                  >
                    ↻
                  </div>
                  <div
                    style={{ ...stylequick, width: "30px" }}
                    onClick={() => {
                      thisclose && thisclose[func.id]();
                      this.unmount(func);
                    }}
                  >
                    &times;
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export class PostIdToSubdocumentClass extends React.Component {
  componentDidUpdate = async (prevProps) => {
    //if (this.state.drops !== this.state.lastDrops)
    //this.setState({ lastDrops: this.state.drops }, () => {});
    if (this.props.droppable !== prevProps.droppable)
      this.props.droppable.forEach((obj) => {
        //hydratePost (banned on Medium.com vianickcarducci.medium.com, 5/2021)
        if (!obj.dropId.startsWith("")) return null;
        const id = obj.dropId.replace(/^[a-zA-Z]/g, "");
        const coll = obj.dropId.substring(0, obj.dropId.indexOf(id));

        onSnapshot(
          doc(this.props.firestore, coll, id),
          (doc) => {
            if (doc.exists()) {
              //snapshotQuery.orderBy is not a function
              var foo = doc.data();
              foo.collection = coll;
              foo.id = id;
              foo.messageAsArray = foo.message ? arrayMessage(foo.message) : [];
              let rest = [];
              let newFreedoc = null;
              this.props.freedocs.forEach((y) => {
                const thisone = y.docs.find((x) => x.dropId === obj.dropId);
                if (thisone) {
                  thisone.drop = foo;
                  return (newFreedoc = {
                    ...y,
                    docs: [
                      ...y.docs.filter((x) => x.dropId !== thisone.dropId),
                      thisone
                    ]
                  });
                }
                rest.push(y);
              });
              this.props.setJail({ freedocs: [...rest, newFreedoc] });
            }
          },
          standardCatch
        );
      });
    if (this.props.droppables !== prevProps.droppables)
      this.props.droppables.forEach((drops) => {
        drops.forEach((obj) => {
          //hydratePost (banned on Medium.com vianickcarducci.medium.com, 5/2021)
          if (!obj.dropId.startsWith("")) return null;
          const id = obj.dropId.replace(/^[a-zA-Z]/g, "");
          const coll = obj.dropId.substring(0, obj.dropId.indexOf(id));

          onSnapshot(
            doc(this.props.firestore, coll, id),
            (doc) => {
              if (doc.exists()) {
                var foo = doc.data();
                foo.collection = coll;
                foo.id = id;
                foo.messageAsArray = foo.message
                  ? arrayMessage(foo.message)
                  : [];
                let rest = [];
                let newFreedoc = null;
                this.props.freedocs.forEach((y) => {
                  const thisone = y.docs.find((x) => x.dropIds === obj.dropIds);
                  if (thisone) {
                    thisone.drops = [
                      ...thisone.drops.filter(
                        (x) => x.collection + x.id !== foo.collection + x.id
                      ),
                      foo
                    ];
                    return (newFreedoc = {
                      ...y,
                      docs: [
                        ...y.docs.filter((x) => x.dropId !== thisone.dropId),
                        thisone
                      ]
                    });
                  }
                  rest.push(y);
                });
                this.props.setJail({ freedocs: [...rest, newFreedoc] });
              }
            },
            standardCatch
          );
        });
      });
  };
  render() {
    return <div />;
  }
}
class JailClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = { updateables: [] };
    this.closeTimeouts = {};
    this.closeTimer = {};
    this.aliveTimer = {};
  }
  /*matchy = (snapshotQuery, near) => {
    //const dele = snapshotQuery._delegate ? snapshotQuery : snapshotQuery._query;
    //console.log(snapshotQuery); //_delegate
    const sn = near ? snapshotQuery._query : snapshotQuery[0]._query;
    return !sn.path
      ? ""
      : sn.path.segments.join(",") +
          "/" +
          sn.filters
            .map((x) => (!x.field ? "" : x.field.segments.join("")))
            .join(",") +
          (near
            ? ""
            : snapshotQuery
                .map((x, i) =>
                  snapshotQuery[i].type === "where"
                    ? (!snapshotQuery[i].wa
                        ? ""
                        : snapshotQuery[i].wa.segments.join("")) +
                      snapshotQuery[i].ma +
                      snapshotQuery[i].ga
                    : null
                )
                .filter((x) => x)
                .join("/"));
  };*/
  componentWillUnmount = () => {
    this.props.updatedclasses.forEach((x) => {
      this.closeTimer[matchy(x.snapshotQuery, x.near)] &&
        clearTimeout(this.closeTimer[matchy(x.snapshotQuery, x.near)]);
      this.aliveTimer[matchy(x.snapshotQuery, x.near)] &&
        clearInterval(this.aliveTimer[matchy(x.snapshotQuery, x.near)]);
    });
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.jailclasses !== prevProps.jailclasses) {
      //triggers whenever any friend component in the whole array changes

      //console.log(this.props.jailclasses);
      clearTimeout(this.waitForMore);
      this.waitForMore = setTimeout(() => {
        //console.log(this.props.updatedclasses);
        const there = (x) =>
          this.state.updateables.find(
            (u) => matchy(u.snapshotQuery) === matchy(x.snapshotQuery)
          );
        let updates = [];
        let remounts = [];

        this.props.jailclasses.forEach((x) => {
          const remount = there(x);
          if (remount) return remounts.push(remount);

          updates.push(x);
        });
        /*this.setState(
          {
            updateables: [
              ...this.state.updateables.filter(
                (x) =>
                  !this.props.jailclasses.find(
                    (u) => matchy(u.snapshotQuery) === matchy(x.snapshotQuery)
                  )
              ),
              ...update
            ]
          },
          () => {*/
        if (updates.length > 0) {
          console.log("REACT-FUFFER:", updates);
          this.handleUpdate(updates);
        } else {
          console.log("REACT-FUFFER:", `Nothing new`);
          this.props.updateLiberty(
            null,
            remounts.map((x) => matchy(x.snapshotQuery))
          );
        }
      }, 500);
    }
  }; //I actualy don't think sunk costs ARE a fallacy. opportunity costs are
  //institutional and banks are in alignment
  //invest in yourself vau.money squrrel corn white
  //guns all bluff or nothing
  //peace comes from geohash docket money
  snapshothandler = (
    qs,
    eight,
    match,
    keepalive,
    x,
    verbose,
    uuid,
    alivefor,
    whenOn
  ) => {
    let p = 0;
    let docs = [];
    var qsdocs = !match.includes(".doc(") ? qs.docs : [qs];
    //console.log(qsdocs);
    qsdocs.forEach((doc) => {
      p++;
      if (eight ? doc.exists : doc.exists()) {
        //snapshotQuery.orderBy is not a function
        var foo = fooize(doc, match, keepalive);
        if (foo.dropId)
          this.setState({
            droppable: [
              ...this.state.droppable.filter(
                (d) => d.collection + d.id !== foo.collection + foo.id
              ),
              foo
            ]
          });
        if (foo.dropIds)
          this.setState({
            droppables: [
              ...this.state.droppables.filter(
                (d) => x.collection + d.id !== foo.collection + foo.id
              ),
              foo
            ]
          });
        //foo.dropIds.map((f) => postIdToSubdocumentClass(f))
        //: [];
        docs.push(foo);
      }
    });
    //this.closeTimeouts[match].bind(this);
    if (qsdocs.length === p) {
      //functional-matching match func "fuffer"
      this.props.setJail({
        updatedclasses: [
          ...this.props.updatedclasses.filter((y) => y.id !== match),
          x
        ]
      });
      verbose && console.log("fuffer:" + uuid, x.state, docs);
      this.props.updateLiberty({
        uuid,
        stateAfterLabel: x.stateAfterLabel,
        endBeforeLabel: x.endBeforeLabel,
        state: x.state,
        docsOutputLabel: x.docsOutputLabel,
        alivefor,
        docs,
        startAfter: qsdocs[qsdocs.length - 1],
        endBefore: qsdocs[0],
        id: match,
        verbose,
        whenOn
      });
    }
  }; //an expiring deal and duress is stolen purchase
  run = (
    sort,
    near,
    lim,
    sA,
    eB,
    match,
    alivefor,
    keepalive,
    snapshotQuery,
    whenOn,
    verbose,
    uuid,
    x
  ) => {
    this.aliveTimer[match] && clearInterval(this.aliveTimer[match]);
    this.aliveTimer[match] = setInterval(() => {
      const thisAFor = this.props.alivefors.find((x) => x[match]);
      this.props.setJail({
        alivefors: [
          {
            [match]: !thisAFor ? alivefor - 1000 : thisAFor[match] - 1000
          },
          ...this.props.alivefors.filter((x) => !x[match])
        ]
      });
    }, 1000);
    this.closeTimeouts[match] = near
      ? (sA
          ? snapshotQuery.near(near).startAfter(sA).limit(lim)
          : eB
          ? snapshotQuery.near(near).endBefore(eB).limitToLast(lim)
          : snapshotQuery.near(near).limit(lim)
        ).onSnapshot((e) => {
          //console.log(e.docs);
          this.snapshothandler(
            e,
            near, //  eight,
            match,
            keepalive,
            x,
            verbose,
            uuid,
            alivefor,
            whenOn
          );
        }, standardCatch)
      : onSnapshot(
          query(
            ...snapshotQuery,
            orderBy(
              ...[
                sort && sort.order
                  ? sort.order
                  : this.props.firestore.FieldPath.documentId(),
                sort.by ? sort.by : "desc"
              ]
            ),
            ...(sA
              ? [startAfter(sA), limit(lim)]
              : eB
              ? [endBefore(eB), limitToLast(lim)]
              : [limit(lim)])
          ),
          (e) => {
            //https://stackoverflow.com/questions/47057506/using-limit-with-firestore-queries
            return this.snapshothandler(
              e,
              near, //  eight,
              match,
              keepalive,
              x,
              verbose,
              uuid,
              alivefor,
              whenOn
            );
          },
          (e) => console.log(e.message)
        );
    //console.log(snaps);

    const thisresnap = this.props.resnaps.find((x) => x[match]);
    this.props.setJail({
      resnaps: [
        { [match]: !thisresnap ? x : thisresnap[match] },
        ...this.props.resnaps.filter((x) => !x[match])
      ]
    });
  };
  handleUpdate = (update) =>
    update.forEach((x) => {
      const {
        uuid,
        snapshotQuery,
        keepalive,
        sort,
        near, //sort && near cannot be true (coexist, orderBy used by geohashing)
        limit,
        startAfter,
        endBefore,
        verbose, //REFER TO Readme.md
        whenOn
      } = x;
      //console.log(x);
      /*this.setState({
            updateables: this.state.updateables.filter((x) => x.uuid !== uuid)
          });*/
      verbose && console.log(x.uuid);

      const match = matchy(snapshotQuery, near);
      console.log("match", match);
      var alivefor = keepalive ? keepalive : 3600000;
      const close = () => {
        if (this.aliveTimer[match]) {
          verbose &&
            console.log("dev: this.aliveTimer[match] found in class component");
          clearInterval(this.aliveTimer[match]);
        } /*else
              console.log(
                "dev: this.aliveTimer[match] not found in class component"
              );*/
        this.props.setJail({
          updatedclasses: this.props.updatedclasses.filter(
            (u) => u.id !== match
          ),
          alivefors: this.props.alivefors.filter((x) => !x[match])
        });
        if (this.closeTimeouts[match]) {
          this.closeTimeouts[match]();
          verbose &&
            console.log(
              `REACT-FUFFER: CLOSED @firebase/firestore, Firestore Connection WebChannel transport: ` +
                match
            );
        }
      };
      let pause = 0;
      if (this.props.updatedclasses.find((u) => u.id !== match)) {
        close();
        pause = 3400;
      }

      setTimeout(() => {
        this.run(
          sort,
          near,
          limit, //lim
          startAfter,
          endBefore,
          match,
          alivefor,
          keepalive,
          snapshotQuery,
          whenOn,
          verbose,
          uuid,
          x
        );
        this.closeTimer[match] && clearTimeout(this.closeTimer[match]);
        this.closeTimer[match] = setTimeout(() => close(), alivefor);
        const thisClose = this.props.closes.find((x) => x[match]);
        this.props.setJail({
          closes: [
            { [match]: !thisClose ? close : thisClose[match] },
            ...this.props.closes.filter((x) => !x[match])
          ]
        });
      }, pause);
      if (!x.done) {
        x.done = true;
      }
    });

  render() {
    return (
      <div id="fuffer" ref={this.props.fuffer}>
        <PostIdToSubdocumentClass
          droppable={this.state.droppable}
          droppables={this.state.droppables}
          setJail={this.props.setJail}
          freedocs={this.props.freedocs}
        />
      </div>
    );
  }
}
export { Jail, WakeSnapshot, JailClass };
