import assert from "node:assert/strict";
import test from "node:test";
import {
  projectBlackoutArchitectDevQaTouchAccess as project,
  BLACKOUT_ARCHITECT_DEV_QA_TOUCH_AUTHORITY as AUTH,
  type ArchitectDevQaTouchAccessInput,
} from "../../src/game/blackoutArchitectDevQaTouchAccess";

const safe = (): ArchitectDevQaTouchAccessInput => ({
  explicitDev: true, isPlaying: true, inCampaign: true,
  isWaveBreak: true, isPaused: false, isGameOver: false,
  isPhotoMode: false, isUpgradeSelectionOpen: false,
  normalEncounterBusy: false, qaActive: false,
  guardCurrent: false, directorActive: false,
});

test("C10 DEV safe CAMPAIGN break offers intentional QA entry only",()=>{
  const ready=project(safe());assert.ok(ready);
  assert.equal(ready.mode,"DEV_QA_TOUCH_ACCESS_PRESENTATION");
  assert.equal(ready.qaToggleEnabled,true);
  assert.equal(ready.qaToggleLabel,"ENTER QA");
  assert.equal(ready.directorToggleEnabled,false);
  assert.equal(ready.patternNextEnabled,false);
  assert.ok(Object.isFrozen(ready));
});

test("C10 no UI in production, off-play, other modes or malformed state",()=>{
  for(const patch of [{explicitDev:false},{isPlaying:false},{inCampaign:false}]){
    assert.equal(project({...safe(),...patch}),null);
  }
  assert.equal(project(null),null);
  assert.equal(project({...safe(),isPaused:undefined} as unknown as ArchitectDevQaTouchAccessInput),null);
  assert.equal(project({...safe(),directorActive:true}),null);
});

test("C10 unsafe entry denies wave, active boss, pause, photo, upgrade and loss",()=>{
  for(const patch of [
    {isWaveBreak:false},{normalEncounterBusy:true},
    {isPaused:true},{isPhotoMode:true},{isUpgradeSelectionOpen:true},
    {isGameOver:true},
  ]){
    const value=project({...safe(),...patch});assert.ok(value);
    assert.equal(value.qaToggleEnabled,false,JSON.stringify(patch));
    assert.equal(value.directorToggleEnabled,false);
    assert.equal(value.patternNextEnabled,false);
  }
});

test("C10 current authentic QA enables auto and manual pattern actions exclusively",()=>{
  const manual=project({...safe(),isWaveBreak:false,qaActive:true,guardCurrent:true});
  assert.ok(manual);
  assert.equal(manual.qaToggleEnabled,true);
  assert.equal(manual.qaToggleLabel,"EXIT QA");
  assert.equal(manual.directorToggleEnabled,true);
  assert.equal(manual.directorToggleLabel,"ENABLE AUTO");
  assert.equal(manual.patternNextEnabled,true);
  const auto=project({...safe(),qaActive:true,guardCurrent:true,directorActive:true});
  assert.ok(auto);
  assert.equal(auto.directorToggleLabel,"DISABLE AUTO");
  assert.equal(auto.patternNextEnabled,false);
  assert.equal(auto.directorToggleEnabled,true);
});

test("C10 stale QA still offers explicit teardown, never pattern/director mutation",()=>{
  const stale=project({...safe(),qaActive:true,guardCurrent:false,directorActive:false});
  assert.ok(stale);
  assert.equal(stale.qaToggleEnabled,true);
  assert.equal(stale.directorToggleEnabled,false);
  assert.equal(stale.patternNextEnabled,false);
  const paused=project({...safe(),qaActive:true,guardCurrent:true,isPaused:true});
  assert.ok(paused);
  assert.equal(paused.qaToggleEnabled,true);
  assert.equal(paused.directorToggleEnabled,false);
  assert.equal(paused.patternNextEnabled,false);
});

test("C10 presentation-only authority excludes engine, production and persistence",()=>{
  assert.ok(Object.isFrozen(AUTH));
  assert.deepEqual(Object.entries(AUTH).filter(([,v])=>v===true).map(([k])=>k),[
    "ownsDevOnlyTouchPresentation","ownsReadOnlyActionEligibility",
  ]);
  assert.ok(Object.entries(AUTH).filter(([,v])=>v===false).length>=6);
});
