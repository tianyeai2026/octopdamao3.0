Unicode true
!include "MUI2.nsh"

Name "OctopPet"
OutFile "OctopPet_0.2.0_x64-setup.exe"
InstallDir "$PROGRAMFILES64\OctopPet"
InstallDirRegKey HKLM "Software\OctopPet" "InstallDir"
RequestExecutionLevel admin
VIProductVersion "0.2.0.0"
VIAddVersionKey "ProductName" "OctopPet"
VIAddVersionKey "CompanyName" "Octop"
VIAddVersionKey "FileDescription" "OctopPet Setup"
VIAddVersionKey "FileVersion" "0.2.0.0"
VIAddVersionKey "ProductVersion" "0.2.0.0"
VIAddVersionKey "LegalCopyright" "Octop"

!define MUI_ICON "..\src-tauri\icons\icon.ico"
!define MUI_UNICON "..\src-tauri\icons\icon.ico"
!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\OctopPet.exe"
!define MUI_FINISHPAGE_RUN_TEXT "启动 OctopPet"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "SimpChinese"

Section "MainProgram"
  SetOutPath "$INSTDIR"
  File /oname=OctopPet.exe "..\src-tauri\target\release\octop-pet.exe"
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "Software\OctopPet" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "DisplayName" "OctopPet"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "DisplayIcon" "$INSTDIR\OctopPet.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "DisplayVersion" "0.2.0"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet" "NoRepair" 1
  CreateDirectory "$SMPROGRAMS\OctopPet"
  CreateShortcut "$SMPROGRAMS\OctopPet\OctopPet.lnk" "$INSTDIR\OctopPet.exe" "" "$INSTDIR\OctopPet.exe" 0
  CreateShortcut "$SMPROGRAMS\OctopPet\Uninstall.lnk" "$INSTDIR\uninst.exe" "" "$INSTDIR\uninst.exe" 0
  CreateShortcut "$DESKTOP\OctopPet.lnk" "$INSTDIR\OctopPet.exe" "" "$INSTDIR\OctopPet.exe" 0
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\OctopPet.exe"
  Delete "$INSTDIR\uninst.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\OctopPet\OctopPet.lnk"
  Delete "$SMPROGRAMS\OctopPet\Uninstall.lnk"
  RMDir "$SMPROGRAMS\OctopPet"
  Delete "$DESKTOP\OctopPet.lnk"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\OctopPet"
  DeleteRegKey HKLM "Software\OctopPet"
SectionEnd
