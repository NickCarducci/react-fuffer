# Fuffer, your array-buffer for firebase (in React)!

![alt text](https://www.dl.dropboxusercontent.com/s/an4eso3vvme7mrf/react-fuffer%20sheep.png?dl=0 "react-fuffer-sheep abstract!")

### enables snapshot cleanups with custom keepalive (default is hour-long), longpolling prompts, aliveFor, (soon?) browsing-to-freshen-each-snapshot, pagination, & quoted posts

LICENSE AGPL-3
No redistribution but for strategy of parts, unless retributed

how to use (as this.state.jailclasses change, Fuffer will query and load)
https://codesandbox.io/s/recursing-paper-4vosh?file=/src/data.js
//add field dropIds = [""] and dropId = "" for quoting posts with collectionID string: String(collection + ID), stored in object as drops.  
    
    const keepalive = 3600000;
    const jailclass = {
        uuid: "fetchForum", //forumPosts
      docsOutputLabel: name,
      stateAfterLabel: last,
      endBeforeLabel: undo,
      state: {
        commentsName: NewcommentsName,
        filterTime: true,
        oppositeComments: ExpiredcommentsName,
        oppositeCollection: old
      },
      snapshotQuery: [collection(firestore,"collection"),
        where("communityId", "==", community.id)], //optional canIncludes()?
      keepalive,
      sort: { order: "time", by: "desc" }, //sort
      near: null, //sort && near cannot be true (coexist, orderBy used by geohashing)
      //near for geofirestore { center: near.center, radius: near.distance }
      limit: 14, //limit
      startAfter: null, //startAfter
      endBefore: null, //endBefore
      verbose: true, //verbose
      whenOn: false //whenOn
    };

    this.setState({
        jailclasses: [
          ...this.state.jailclasses.filter((x) => x.uuid !== "fetchForum"),
          jailclass
        ]
    });

...

    const firestore = getFirestore(firebaseappinitialized); //new
    class Data extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          deletedclasses: [],
          closes: [],
          alivefors: [],
          updatedclasses: [],
          jailclasses: [],
          freedocs: []
        }
        this.fuffer = React.createRef();
      }
      render () {
        const {
          jailclasses,
          updatedclasses,
          deletedclasses
        } = this.state; 
        return (
          <div>    
            <JailClass
             firestore={firestore}
              fuffer={this.fuffer}
              jailclasses={jailclasses}
              updateLiberty={(productFuffer) =>
                this.setState(
                  {
                    freedocs: [
                      ...this.state.freedocs.filter(
                        (x) => x.id !== productFuffer.id
                      ),
                      productFuffer
                    ]
                  },
                  () => {
                    clearTimeout(this.stop);
                    this.stop = setTimeout(
                      () =>
                        this.state.freedocs.forEach(
                          (product) =>
                            product &&
                            this.setState(
                              {
                                [product.stateAfterLabel]: product.startAfter,
                                [product.endBeforeLabel]: product.endBefore
                              },
                              () => this.finFetchForum(product)
                            )
                        ),
                      800
                    );
                  }
                )
              }
              updatedclasses={updatedclasses}
              setJail={(x) => this.setState(x)}
              alivefors={this.state.alivefors}
              closes={this.state.closes}
              //={this.state.immutableRegister}
              resnaps={this.state.resnaps}
              freedocs={this.state.freedocs}
            />
            <WakeSnapshot
              jailclasses={jailclasses}
              deletedclasses={deletedclasses}
              setJail={(x) => this.setState(x)}
              updatedclasses={updatedclasses}
              freedocs={this.state.freedocs}
              loadingHeight={loadingHeight}
              isProfile={isProfile}
              openAnyway={this.state.openAnyway}
              remount={(x, func) => {
                this.setState(x, () => {
                  clearTimeout(this.freetime);
                  this.freetime = setTimeout(
                    () =>
                      this.setState({
                        freedocs: [
                          ...this.state.freedocs.filter((x) => x.id !== func.id),
                          func
                        ]
                      }),
                    200
                  );
                });
              }}
              alivefors={this.state.alivefors}
              closes={this.state.closes}
              resnaps={this.state.resnaps}
            />

you can import <WakeSnapshot/> for default styling & ease

Write your own WakeSnapshot component

    class WakeSnapshot extends React.Component {
      unmount = (func) =>
        this.props.setJail({
          jailclasses: this.props.jailclasses.filter((y) => func.id !== y.id),
          closes: this.props.closes.filter((y) => !y[func.id]),
          alivefors: this.props.alivefors.filter((y) => !y[func.id]),
          //deletedclasses is just for remounting without ...traveling
          deletedclasses: [
            ...this.props.deletedclasses,
            { ...func.resnap, id: func.id }
          ],
          updatedclasses: this.props.updatedclasses.filter((u) => u.id !== func.id),
          freedocs: this.props.freedocs.filter((u) => u.id !== func.id)
        });
      remount = (animal) =>
        this.props.remount(
          {
            jailclasses: this.props.jailclasses.filter((y) => animal.id !== y.id),
            closes: this.props.closes.filter((y) => !y[animal.id]),
            alivefors: this.props.alivefors.filter((y) => !y[animal.id]),
            //not deleted...remounted
            //deletedclasses is just for remounting without ...traveling, await for send
            updatedclasses: this.props.updatedclasses.filter(
              (u) => u.id !== animal.id
            ),
            freedocs: this.props.freedocs.filter((u) => u.id !== animal.id),
            resnaps: this.props.resnaps.filter((u) => u.id !== animal.id)
          },
          animal
        );
      flush = () =>
        this.props.freedocs.forEach((animal) => {
          this.remount(animal);
        });

      render() {
        const { loadingHeight, isProfile, openAnyway, freedocs } = this.props;
        const goingSnapshots = freedocs && freedocs.constructor === Array;
        const atLeastOne =
          goingSnapshots &&
          freedocs.find((x) => x.aliveFor > 0 && x.aliveFor < 1200000);
        const open = atLeastOne || openAnyway;
        const stylequick = {
          margin: "0px 20px",
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
              height: open ? loadingHeight : "0%",
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
              {freedocs &&
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
                      <div style={{ ...stylequick, width: "30px" }}>
                        <img
                          style={{
                            width: "10px",
                            height: "10px"
                          }}
                          src={refresh}
                          alt="redo"
                          onClick={() => this.remount(func)}
                        />
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
          
hook

    let collection = "posts"
    let old = "oldPosts"
    let dol = [];
    let p = 0;
    const keepalive = 3600000;
    const firestore = getFirestore(firebaseappinitialized); //new
    const free = Jail(
      [collection(firestore,"collection"),
        where("communityId", "==", community.id)],
      keepalive,
      { order: "time", by: "desc" },
      null,
      14,
      null,
      null, 
      true,
      firestore
    ); 
    free.docs.forEach(async (foo) => {
      p++;
      foo.collection = collection;
      if (filterTime) foo.datel = new Date(foo.date.seconds * 1000);
      if (!filterTime || foo.datel > new Date()) {
        canIView(this.props.auth, foo, community) && dol.push(foo);
      } else if (this.props.auth !== undefined)
        setDoc(doc(firestore,foo.collection,foo.id))
          .then(() =>
            deleteDoc(doc(firestore,lastCollection,foo.id))
              .then(() =>
                console.log(
                  `document moved to ${foo.collection} collection ` + foo.id
                )
              )
              .catch(standardCatch)
          .catch(standardCatch)
    });
    if (free.docs.length === p) 
      this.setPosts({ [collection]: dol })
    };

Hooks' drops are not live with snapshot but use get(), someone please help or at least let me know you want it.  I use classes

SEE LICENSE IN LICENSE.lz.txt

copying the src code? https://github.com/npm/cli/issues/3514
npm install --force npm uninstall @babel/polyfill --save ...